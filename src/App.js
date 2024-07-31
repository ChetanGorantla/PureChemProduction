import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import Reactions from './pages/Reactions';
import Titrations from './pages/Titrations';
import Questions from './pages/Questions';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reactions" element={<Reactions/>} />
        <Route path="/titrations" element={<Titrations/>} />
        <Route path="/predictions" element={<Predictions/>} />
        <Route path="/problems" element={<Questions/>} />
      </Routes>
    </Router>
  );
};

export default App;