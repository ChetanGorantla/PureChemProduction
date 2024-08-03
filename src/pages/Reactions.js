import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';

const Reactions = () => {
  let [hashMap, setHashMap] = useState({});
  const [selected, setSelected] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [K, setK] = useState(1);
  const [balancedEq, setBalancedEq] = useState('');
  const [backendBalancedEq, setBackendBalancedEq] = useState('');
  const [equation, setEquation] = useState('');
  const [isRedox, setIsRedox] = useState(false);
  const [redoxType, setRedoxType] = useState('');
  const [redoxResults, setRedoxResults] = useState({});
  const [error, setError] = useState('');
  const [deltaG, setDeltaG] = useState(0);
  const [deltaH, setDeltaH] = useState(0);
  const [deltaS, setDeltaS] = useState(0);
  const [volume, setVolume] = useState(1); 
  const [reactantList, setReactantList] = useState([]); 
  const [productList, setProductList] = useState([]); 
  const [reactantValues, setReactantValues] = useState({});
  const [productValues, setProductValues] = useState({});
  const [iceResults, setIceResults] = useState({});
  const [bcaResults, setBcaResults] = useState({});
  const [iceString, setIceString] = useState('');

  useEffect(() => {
    if (backendBalancedEq) {
      getDeltaCalculations(backendBalancedEq);
    }
  }, [backendBalancedEq]);

  const balanceEquation = async (equation) => {
    try {
      const response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/balance-equation', { reaction: equation });
      
      const unformattedBalancedEquation = response.data.result;
      const formattedBalancedEquation = formatEquation(unformattedBalancedEquation);
      setBalancedEq(formattedBalancedEquation);
      setBackendBalancedEq(unformattedBalancedEquation);
      
      await splitReaction(equation);
    } catch (error) {
      console.error('Error balancing equation', error);
      setError(error.response?.data?.error || 'An error occurred while balancing the equation.');
    }
  };

  useEffect(() => {
    if (backendBalancedEq) {
      getDeltaCalculations(backendBalancedEq);
    }
  }, [backendBalancedEq]);

  const cleanUpStates = (list) => {
    return list.map(item => item.replace(/\([a-z]+\)/g, ''));
  };

  const splitReaction = async (equation) => {
    try {
      const response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/split-reaction', { reaction: equation });
      setReactantList(cleanUpStates(response.data.reactants));
      setProductList(cleanUpStates(response.data.products));

      const initialReactantValues = response.data.reactants.reduce((acc, curr) => ({ ...acc, [cleanUpStates([curr])[0]]: 0 }), {});
      const initialProductValues = response.data.products.reduce((acc, curr) => ({ ...acc, [cleanUpStates([curr])[0]]: 0 }), {});
      setReactantValues(initialReactantValues);
      setProductValues(initialProductValues);
      
    } catch (error) {
      console.error('Error splitting reaction', error);
      setError(error.response?.data?.error || 'An error occurred while splitting the reaction.');
    }
  };

  const getDeltaCalculations = async (backendBalancedEq) => {
    console.log("BALANCED EQ: ", backendBalancedEq);
    if (!backendBalancedEq.includes('(s)') && !backendBalancedEq.includes('(l)') && !backendBalancedEq.includes('(g)') && !backendBalancedEq.includes('(aq)')) {
      setError('No states given, cannot calculate dG, dH, dS');
      return;
    }

    try {
      const response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/delta-calculations', { reaction: backendBalancedEq });
      const { delta_g0, delta_s0, delta_h0, K } = response.data;
      setDeltaG(delta_g0);
      setDeltaS(delta_s0);
      setDeltaH(delta_h0);
      setK(K);
      
      console.log("retrieved delta calculations")
    } catch (error) {
      console.error('Error getting delta calculations', error);
      setError(error.response?.data?.error || 'An error occurred while getting delta calculations.');
    }
  };

  const cleanUpTags = (formattedString) => {
    return formattedString.replace(/<sub>\s*<\/sub>/g, '').replace(/<sub>\(<\/sub>/g, '').replace(/<sub>\(/g, '(');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (equation.includes('^')) {
      setBalancedEq('Not applicable');
      setBackendBalancedEq('Not applicable');
      setShowResults(true);
    } else {
      setBalancedEq('');
      setBackendBalancedEq('');
      setDeltaG(0);
      setDeltaH(0);
      setDeltaS(0);
      setK(0);
      const cleanedEquation = cleanUpTags(equation.replace(/<sub>|<\/sub>|<sup>|<\/sup>/g, ''));
      balanceEquation(cleanedEquation);
      setShowResults(true);
    }
  };

  const formatEquation = (input) => {
    const parts = input.split(/(\s+|\+|=|->|<-)/);
    const formattedParts = parts.map(part => {
      part = part.replace(/(\d+)?([A-Za-z][a-z]*)(\d*)/g, (match, p1, p2, p3) => {
        const normalNumber = p1 ? p1 : '';
        const element = p2;
        const subscriptNumber = p3 ? p3.replace(/(\d+)/g, '<sub>$1</sub>') : '';
        return `${normalNumber}${element}${subscriptNumber}`;
      });
      part = part.replace(/\((g|l|s|aq)\)/g, '<sub>($1)</sub>');
      part = part.replace(/\)(\d+)/g, ')<sub>$1</sub>');

      part = part.replace(/\^(\S)(\S?)/g, (match, p1, p2) => {
        if (p2 && p2 !== ' ') {
          return `<sup>${p1}${p2}</sup>`;
        }
        return `<sup>${p1}</sup>`;
      });

      return part;
    });
    return formattedParts.join('');
  };

  const handleInputChange = (e) => {
    setEquation(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleReactantChange = (e, item) => {
    setReactantValues({ ...reactantValues, [item]: e.target.value });
    console.log(reactantValues);
  };

  const handleProductChange = (e, item) => {
    setProductValues({ ...productValues, [item]: e.target.value });
    console.log(productValues);
  };

  const handleIceCalculation = async () => {
    try {
      const response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/ice-calculator', {
        reaction: backendBalancedEq,
        RM: reactantValues,
        PM: productValues,
        volume: volume,
        K: K
      });
      console.log(backendBalancedEq);
      setIceResults({ R: response.data.R, P: response.data.P });
      setIceString(response.data.string);
      
      setBcaResults({});
    } catch (error) {
      console.error('Error calculating ICE table', error);
      setError(error.response?.data?.error || 'An error occurred while calculating ICE table.');
    }
  };

  const handleBcaCalculation = async () => {
    try {
      const response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/bca-calculator', {
        reaction: backendBalancedEq,
        RM: reactantValues,
        PM: productValues,
        volume: volume,
      });
      console.log(backendBalancedEq);
      setBcaResults({
        remaining_reactants: response.data.remaining_reactants,
        final_products: response.data.final_products,
      });
      
      setIceResults({});
    } catch (error) {
      console.error('Error calculating BCA table', error);
      setError(error.response?.data?.error || 'An error occurred while calculating BCA table.');
    }
  };

  const handleToggleOption = (option) => {
    setSelected(prevSelected => (prevSelected === option ? '' : option));
    if (option === 'ICE') {
      handleIceCalculation();
    } else if (option === 'BCA') {
      handleBcaCalculation();
    }
  };

  const handleRedoxChange = (e) => {
    setIsRedox(e.target.checked);
    if (!e.target.checked) {
      setRedoxType('');
      setRedoxResults({});
    }
  };

  const handleRedoxType = async (type) => {
    setRedoxType(prevType => (prevType === type ? '' : type));
    try {
      const endpoint = type === 'Acid' ? 'acid-redox-equations' : 'base-redox-equations';
      const response = await axios.post(`https://purechem-263a4a4b5c6d.herokuapp.com/${endpoint}`, { reaction: equation });
      setRedoxResults(response.data);
      setEquation(response.data);

      // Extract the last redox equation and set it for delta calculations
      const lastRedoxEquation = response.data.new_reaction;
      setBackendBalancedEq(lastRedoxEquation);
      
    } catch (error) {
      console.error(`Error getting ${type.toLowerCase()} redox equations`, error);
      setError(error.response?.data?.error || `An error occurred while getting ${type.toLowerCase()} redox equations.`);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="column-header-flex">
        <div className="column-header-flex">
          <div className="equation-display">
            <h3 dangerouslySetInnerHTML={{ __html: formatEquation(equation) }} />
          </div>
          <nav className="equation-input-and-button">
            <form id="equation-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={equation}
                onChange={handleInputChange}
                placeholder="Enter any chemistry equation and we'll balance it!"
              />
            </form>
            
          </nav>
        </div>
        <button onClick={handleSubmit} style={{ borderRadius: 10 }}>Balance Equation</button>
        {showResults && <h2 dangerouslySetInnerHTML={{ __html: `Balanced Equation: ${cleanUpTags(formatEquation(balancedEq))}` }} />}
        {error && <h2 style={{ color: 'red' }}>{error}</h2>}
        {showResults && redoxResults.first && (
          <div>
            <h3>Redox Results:</h3>
            <p dangerouslySetInnerHTML={{ __html: cleanUpTags(formatEquation(redoxResults.first)) }}/>
            <p dangerouslySetInnerHTML={{ __html: cleanUpTags(formatEquation(redoxResults.second)) }}/>
            <p dangerouslySetInnerHTML={{ __html: cleanUpTags(formatEquation(redoxResults.new_reaction)) }}/>
          </div>
        )}
      </div>

      {showResults &&
        <div className="center-header-flex">
          <div>
            <label>Volume </label>
            <input
              type="number"
              value={volume}
              onChange={handleVolumeChange}
              style={{ borderRadius: 10, width: 75 }}
              
              placeholder ="Enter liters"
            />
          </div>
        </div>
      }

      {showResults &&
      <div className = "column-header-flex">
        <div className="center-header-flex">
          <div className="column-header-flex">
            <h3>Reactants</h3>
            <div className="center-header-flex">
              {reactantList.map((item, index) => (
                <div key={index}>
                  <label>{item}</label>
                  <input
                    type="text"
                    value={reactantValues[item]}
                    onChange={(e) => handleReactantChange(e, item)}
                    style={{ borderRadius: 10, width: 75, marginLeft: 10 }}
                  />
                  {iceResults.R && iceResults.R[item] !== undefined && (
                    <p>{iceResults.R[item]} M</p>
                  )}
                  {bcaResults.remaining_reactants && bcaResults.remaining_reactants[item] !== undefined && (
                    <p>{bcaResults.remaining_reactants[item]} moles</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="column-header-flex">
            <h3>Products</h3>
            <div className="center-header-flex">
              {productList.map((item, index) => (
                <div key={index}>
                  <label>{item}</label>
                  <input
                    type="text"
                    value={productValues[item]}
                    onChange={(e) => handleProductChange(e, item)}
                    style={{ borderRadius: 10, width: 75, marginLeft: 10 }}
                  />
                  {iceResults.P && iceResults.P[item] !== undefined && (
                    <p>{iceResults.P[item]} M</p>
                  )}
                  {bcaResults.final_products && bcaResults.final_products[item] !== undefined && (
                    <p>{bcaResults.final_products[item]} moles</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
        {selected === 'ICE' && iceString && (
          <div>
            <h4>{iceString}</h4>
          </div>
        )}
        </div>
      }
      <div>
        {showResults && (
          <div>
            <p>Enter using units of M or g or moles</p>
            <p>ex. 34.5 g</p>
          </div>
        )}
      </div>

      <div className="center-header-flex">
        {showResults &&
          <div className="switch">
            <button
              className={`option ${selected === 'ICE' ? 'selected' : ''}`}
              onClick={() => handleToggleOption('ICE')}
              style = {{backgroundColor: '#8fbf99'}}
            >
              ICE
            </button>
            <button
              className={`option ${selected === 'BCA' ? 'selected' : ''}`}
              onClick={() => handleToggleOption('BCA')}
              style = {{backgroundColor: '#8fbf99'}}
            >
              BCA
            </button>
          </div>
        }
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <label>
            Redox?
            <input
              type="checkbox"
              checked={isRedox}
              onChange={handleRedoxChange}
              style={{ marginLeft: 10 }}
            />
          </label>
          {isRedox && (
            <>
              <button
                className={`option ${redoxType === 'Acid' ? 'selected' : ''}`}
                onClick={() => handleRedoxType('Acid')}
                style={{ marginLeft: 10 }}
              >
                Acid
              </button>
              <button
                className={`option ${redoxType === 'Base' ? 'selected' : ''}`}
                onClick={() => handleRedoxType('Base')}
                style={{ marginLeft: 10 }}
              >
                Base
              </button>
            </>
          )}
        </div>
      </div>

      {showResults && (
        <div className='center-header-flex'>
          <div className='column-header-flex'>
            <div>{"dG: " + deltaG}</div>
            <div>{"dH: " + deltaH}</div>
            <div>{"dS: " + deltaS}</div>
            <div>
              {"K: "}
              <input
                type="number"
                value={K}
                onChange={(e) => setK(e.target.value)}
                style={{ borderRadius: 10, width: 100, marginLeft: 10 }}
              />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Reactions;
