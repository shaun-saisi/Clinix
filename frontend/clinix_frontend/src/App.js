import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsList from './ClientsList';
import Homepage from './Homepage';
import Programs from './Programs';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/clients" element={<ClientsList />} /> 
        <Route path="/programs" element={<Programs />} />
      </Routes>
    </Router>
  );
};

export default App;
