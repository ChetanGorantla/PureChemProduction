import {React} from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import EquationInput from '../components/EquationInput';
import { Analytics } from "@vercel/analytics/react"


const Home = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
  
    navigate('/reactions');
  };
  return (
    <div>
      <Navigation />
      <Header />
      <div className="equation-input-and-button">
        <button onClick = {handleSubmit}>
          Get started
        </button>
      </div>
      <Analytics/>
      
    </div>
  );
};

export default Home;