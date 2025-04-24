import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClientsList from './ClientsList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientsList />} />  
      </Routes>
    </Router>
  );
};

export default App;
