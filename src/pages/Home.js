import { React } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import EquationInput from '../components/EquationInput';
import { Analytics } from "@vercel/analytics/react";
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/reactions');
  };

  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>
      <Navigation />
      <Header />
      
      <div>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/gpzdDYmi8fw" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>

      <div className="equation-input-and-button">
        <button onClick={handleSubmit}>
          Get started
        </button>
      </div>
      <Analytics/>
      <Footer/>
    </div>
  );
};

export default Home;
