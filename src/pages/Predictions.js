import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';

const Predictions = () => {
  const [meltingString, setMeltingString] = useState('');
  const [solubilityString, setSolubilityString] = useState('');
  const [responseDataMelting, setResponseDataMelting] = useState(null);
  const [responseDataSolubility, setResponseDataSolubility] = useState(null);

  // Dummy data
  const meltingList = ['H2O', 'NaCl', 'C6H12O6'];
  const solubilityList = ['2(H2)', 'O2', '2(H2O)'];

  const handleMeltingChange = (e) => {
    setMeltingString(e.target.value);
  };

  const handleSolubilityChange = (e) => {
    setSolubilityString(e.target.value);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      let response;
      if (type === 'melting') {
        response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/sort-melting', {
          molecules: meltingString,
        });
        setResponseDataMelting(response.data.result);
      } else if (type === 'solubility') {
        response = await axios.post('https://purechem-263a4a4b5c6d.herokuapp.com/sort-solubility', {
          compounds: solubilityString,
        });
        setResponseDataSolubility(response.data.result);
      }
    } catch (error) {
      console.error('Error sending data to API', error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="total-header-flex" style={{ marginTop: 20 }}>
        <div className="column-header-flex">
          <h1>Melting Point</h1>
          <div className="equation-input-and-button">
            <form id="melting-form" onSubmit={(e) => handleSubmit(e, 'melting')}>
              <input
                type="text"
                name="melting"
                value={meltingString}
                onChange={handleMeltingChange}
                placeholder="Enter a list of compounds separated by commas"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <h2>{responseDataMelting}</h2>
            
          </div>
        </div>
        <div className="column-header-flex">
          <h1>Solubility</h1>
          <div className="equation-input-and-button">
            <form id="solubility-form" onSubmit={(e) => handleSubmit(e, 'solubility')}>
              <input
                type="text"
                name="solubility"
                value={solubilityString}
                onChange={handleSolubilityChange}
                placeholder="Enter a list of compounds separated by commas"
              />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <h2>{responseDataSolubility}</h2>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
