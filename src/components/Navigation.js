import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

const Navigation = () => {
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();

  React.useEffect(() => {
    setActiveButton(location.pathname);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">PureChem</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link 
            to="/reactions" 
            className={`nav-button ${activeButton === '/reactions' ? 'active' : ''}`}
            onClick={() => setActiveButton('/reactions')}
          >
            Reaction Calculator
          </Link>
        </li>
        <li>
          <Link 
            to="/titrations" 
            className={`nav-button ${activeButton === '/titrations' ? 'active' : ''}`}
            onClick={() => setActiveButton('/titrations')}
          >
            Titrations
          </Link>
        </li>
        <li>
          <Link 
            to="/predictions" 
            className={`nav-button ${activeButton === '/predictions' ? 'active' : ''}`}
            onClick={() => setActiveButton('/predictions')}
          >
            Solubility/Melting Point Predictions
          </Link>
        </li>
        <li>
          <Link 
            to="/problems" 
            className={`nav-button ${activeButton === '/problems' ? 'active' : ''}`}
            onClick={() => setActiveButton('/problems')}
          >
            Question Bank
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
