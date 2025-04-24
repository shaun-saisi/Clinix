import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsList from './ClientsList';
import Homepage from './Homepage';
import Programs from './Programs';
import ClientProfile from './ClientProfile';
import ProgramDetails from './ProgramDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />  
        <Route path="/clients" element={<ClientsList />} /> 
        <Route path="/programs" element={<Programs />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
