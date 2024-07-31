import React from 'react';
import '../App.css'; // Adjust the path based on your project structure

let backgroundImage = 'https://img.freepik.com/premium-photo/two-chemist-cats-conducting-experiments-laboratory_961443-101.jpg'
const Header = () => {
  return (
    <div className = "total-header-flex" style = {{marginTop:30}}>
      <div>
      
          <h2 style = {{fontSize:"40px"}}>What is PureChem?</h2>
          <p style = {{fontSize:"20px"}}>PureChem is a website designed to help students prepare for AP Chemistry and USNCO.</p>
          <p style = {{fontSize:"20px"}}>Features of this website include:</p>
          <ul className = "styled-list">
            <li className = "bullets">Reaction calculator that can balance equations, calculate dG, dH, dS, <br/>and provide an ICE and RICE table</li>
            <br></br>
            <li className = "bullets">Titration calculator that calculates the pH at different parts of a titration and finds the unknown molarity</li>
            <br></br>
            <li className = "bullets">Solubility and Melting point predictors that reorder given compounds in order of <br/>solubility or melting point</li>
            <br></br>
            <li className = "bullets">100+ practice problems for all chemistry topics</li>
          </ul>
        
      </div>
      <div className="header-container">
        <img src={backgroundImage} alt="Cats doing chemistry" className="header-image" />
        <div className="header-text">
          <h1>Replace with video</h1>
        </div>
      </div>
    </div>
    
  );
};

export default Header;
