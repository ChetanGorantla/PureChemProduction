import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EquationInput = () => {
  const [equation, setEquation] = useState('');
  

  const handleInputChange = (e) => {
    const formattedEquation = formatEquation(e.target.value);
    setEquation(formattedEquation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the equation input as needed, then redirect
    
  };

  const handleButtonClick = () => {
    document.getElementById('equation-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  };

  const formatEquation = (input) => {
    // Split input into parts by spaces and operators
    const parts = input.split(/(\s+|\+|=|->|<-)/);
  
    // Process each part to format numbers correctly
    const formattedParts = parts.map(part => {
      // If the part starts with a number, keep the first number normal and format the rest
      part = part.replace(/(\d+)?([A-Za-z][a-z]*)(\d*)/g, (match, p1, p2, p3) => {
        const normalNumber = p1 ? p1 : '';
        const element = p2;
        const subscriptNumber = p3 ? p3.replace(/(\d+)/g, '<sub>$1</sub>') : '';
        return `${normalNumber}${element}${subscriptNumber}`;
      });
  
      // Format state symbols as subscripts
      part = part.replace(/\((g|l|s|aq)\)/g, '<sub>($1)</sub>');
  
      // Format any number right after a closing parenthesis as a subscript
      part = part.replace(/\)(\d+)/g, ')<sub>$1</sub>');
  
      return part;
    });
  
    // Join the formatted parts back together
    return formattedParts.join('');
  };

 

  return (
    <div className="column-header-flex">
      <div className="equation-display">
        <h3 dangerouslySetInnerHTML={{ __html: equation }} />
      </div>

      <nav className="equation-input-and-button">
        <form id="equation-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={equation.replace(/<sub>|<\/sub>/g, '')}
            onChange={handleInputChange}
            placeholder="Enter any chemistry equation and we'll balance it!"
          />
        </form>
        <button onClick={handleButtonClick}>Solve</button>
      </nav>
    </div>
  );
};

export default EquationInput;
