import React, { useState } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation';
import '../App.css';

const Titrations = () => {
  const [selectedOption, setSelectedOption] = useState('Titrating weak acid with strong base');
  const [selectedForm, setSelectedForm] = useState('molarity');
  const [dropdown, setDropdown] = useState('acid');
  const [sigFigs, setSigFigs] = useState(2);
  const [formDataPH, setFormDataPH] = useState({
    Ka: '',
    Kb: '',
    Ma: '',
    Mb: '',
    Vi: '',
    V_added: '',
  });
  const [formDataMolarity, setFormDataMolarity] = useState({
    given:'',
    initial:'',
    final:'',
    sigfig:'2',
  });
  const [responsePHData, setResponsePHData] = useState(null);
  const [responseMolarityData, setResponseMolarityData] = useState(null);

  const handleSigFigsInputChange = (e) => {
    setSigFigs(e.target.value);
  };

  const handlePHChange = (e) => {
    setFormDataPH({
      ...formDataPH,
      [e.target.name]: e.target.value,
    });
  };
  const handleMolarityChange = (e) => {
    setFormDataMolarity({
      ...formDataMolarity,
      [e.target.name]: e.target.value,
    });
  };

  const handlePHSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedForm === 'ph') {
        if (selectedOption === 'Titrating weak acid with strong base' || selectedOption === 'titrating weak acid with strong base') {
          response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/calculate-ph-sbtwasig', {
            Ka: formDataPH.Ka,
            Ma: formDataPH.Ma,
            Mb: formDataPH.Mb,
            Vi: formDataPH.Vi,
            V_added: formDataPH.V_added,
            sig: sigFigs,
          });
        } else if (selectedOption === 'titrating strong acid with strong base' || selectedOption === 'Titrating strong acid with strong base') {
          response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/calculate-ph-sbtsasig', {
        
            Mb: formDataPH.Mb,
            Ma: formDataPH.Ma,
            Vi: formDataPH.Vi,
            V_added: formDataPH.V_added,
            sig: sigFigs,
          });
        } else if (selectedOption === 'titrating weak base with strong acid' || selectedOption === 'Titrating weak base with strong acid') {
          response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/calculate-ph-satwbsig', {
            Kb: formDataPH.Kb,
            Mb: formDataPH.Mb,
            Ma: formDataPH.Ma,
            Vi: formDataPH.Vi,
            V_added: formDataPH.V_added,
            sig: sigFigs,
          });
        } else if (selectedOption === 'titrating strong base with strong acid' || selectedOption === 'Titrating strong base with strong acid') {
          response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/calculate-ph-satsbsig', {
            Ma: formDataPH.Ma,
            Mb: formDataPH.Mb,
            
            Vi: formDataPH.Vi,
            V_added: formDataPH.V_added,
            sig: sigFigs,
          });
        }
        
      }
      setResponsePHData(response.data.result);
    } catch (error) {
      console.error('Error sending data to API', error);
    }
  };

  const handleMolaritySubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedForm === 'molarity') {
        
          response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/calculate-molarity', {
            given: formDataMolarity.given,
            initial: formDataMolarity.initial,
            final: formDataMolarity.final,
            sigfig: formDataMolarity.sigfig

          });
        
      }
      setResponseMolarityData(response.data.result);
    } catch (error) {
      console.error('Error sending data to API', error);
    }
  };


  const renderPHForm = () => {
    const isAcidWithBaseTitration = selectedOption.includes('base with strong acid');
    const isBaseWithAcidTitration = selectedOption.includes('');
    const isStrongAcidBaseTitration = selectedOption.includes('titrating strong');
  
    return (
      <div className="form-container">
        <div className="form-group">
          <label>
            {isAcidWithBaseTitration ? 'Ka' : 'Kb'}:
            <input
              type="text"
              name={isAcidWithBaseTitration ? 'Ka' : 'Kb'}
              value={isStrongAcidBaseTitration ? 'NOT NEEDED' : formDataPH[isAcidWithBaseTitration ? 'Ka' : 'Kb']}
              onChange={handlePHChange}
              placeholder={`${isAcidWithBaseTitration ? 'Ka' : 'Kb'}`}
              readOnly={isStrongAcidBaseTitration}
            />
          </label>
        </div>
        <div className='total-header-column'>
          <div className='center-header-flex'>
            <div className="form-group">
              <label>
                Initial volume of {isAcidWithBaseTitration ? 'acid' : 'base'}:
                <input type="number" name="Vi" value={formDataPH.Vi} min="0" onChange={handlePHChange} placeholder={`Enter initial volume of ${isAcidWithBaseTitration ? 'acid' : 'base'}`} />
              </label>
            </div>
            <div className="form-group">
              <label>
                Initial molarity of {isAcidWithBaseTitration ? 'acid' : 'base'}:
                <input type="number" name="Ma" value={formDataPH.Ma} min="0" onChange={handlePHChange} placeholder={`Enter initial molarity of ${isAcidWithBaseTitration ? 'acid' : 'base'}`} />
              </label>
            </div>
          </div>
          <div className='center-header-flex'>
            <div className="form-group">
              <label>
                Molarity of {isAcidWithBaseTitration ? 'base' : 'acid'}:
                <input type="number" name="Mb" value={formDataPH.Mb} min="0" onChange={handlePHChange} placeholder={`Enter molarity of ${isAcidWithBaseTitration ? 'base' : 'acid'}`} />
              </label>
            </div>
            <div className="form-group">
              <label>
                Volume of {isAcidWithBaseTitration ? 'base added' : 'acid added'}:
                <input type="number" name="V_added" value={formDataPH.V_added} min="0" onChange={handlePHChange} placeholder={`Enter volume of ${isAcidWithBaseTitration ? 'base added' : 'acid added'}`} />
              </label>
            </div>
          </div>
        </div>
        <div className="sig-figs-input">
          <h2>Significant Figures</h2>
          <input
            type="number"
            value={sigFigs}
            onChange={handleSigFigsInputChange}
            min="2"
          />
        </div>
        <button className="calculate-button" onClick={handlePHSubmit}>Calculate</button>
        <div className="result">
          <h5>pH = {responsePHData}</h5>
        </div>
      </div>
    );
  };
  
  
  const renderMolarityForm = () => {
    return (
      <div className="form-container">
        <div className="form-group">
          <label>
            Select Initial Concentration:
            <select value={dropdown} onChange={(e) => setDropdown(e.target.value)}>
              <option value="acid">Initial Acid Concentration</option>
              <option value="base">Initial Base Concentration</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Initial Concentration of {dropdown}:
            <input type="number" name="given" value={formDataMolarity.given} min="0" onChange={handleMolarityChange} placeholder={`Enter initial volume of ${dropdown}`} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Initial Volume of {dropdown}:
            <input type="number" name="initial" value={formDataMolarity.initial} min="0" onChange={handleMolarityChange} placeholder={`Enter initial volume of ${dropdown}`} />
          </label>
        </div>
        <div className="form-group">
          <label>
            Final Volume of {dropdown}:
            <input type="number" name="final" value={formDataMolarity.final} min="0" onChange={handleMolarityChange} placeholder={`Enter final volume of ${dropdown}`} />
          </label>
        </div>
        <div className="form-group">
          <label>
            <h3>Unknown Concentration of {dropdown === 'acid' ? 'base' : 'acid'}: {responseMolarityData}</h3>
            
          </label>
        </div>
        <div className="sig-figs-input">
          <h2>Significant Figures</h2>
          <input
            type="number"
            value={formDataMolarity.sigFigs}
            onChange={handleSigFigsInputChange}
            min="2"
          />
        </div>
        <button className="calculate-button" onClick={handleMolaritySubmit}>Calculate</button>
      </div>
    );
  };

  return (
    <div>
      <Navigation />
      <div className="center-header-flex">
        <div className="molarity-button-container">
          <button 
            className={`molarity-button ${selectedForm === 'molarity' ? 'selected' : ''}`} 
            onClick={() => setSelectedForm('molarity')}
          >
            Molarity
          </button>
          <button 
            className={`molarity-button ${selectedForm === 'ph' ? 'selected' : ''}`} 
            onClick={() => setSelectedForm('ph')}
          >
            pH
          </button>
        </div>
      </div>
      {selectedForm === 'molarity' && renderMolarityForm()}
      {selectedForm === 'ph' && (
        <div className="form-container">
          <div className="form-group">
            <label>
              Select Titration Type:
              <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="Titrating weak acid with strong base">Titrating weak acid with strong base</option>
                <option value="titrating strong acid with strong base">Titrating strong acid with strong base</option>
                <option value="titrating weak base with strong acid">Titrating weak base with strong acid</option>
                <option value="titrating strong base with strong acid">Titrating strong base with strong acid</option>
              </select>
            </label>
          </div>
          {renderPHForm()}
        </div>
      )}
    </div>
  );
};

export default Titrations;
