//All routing for my pages is handled here 

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import ClientsList from './ClientsList';
import Homepage from './Homepage';
import Programs from './Programs';
import ClientProfile from './ClientProfile';
import ProgramDetails from './ProgramDetails';
import EnrollClient from './EnrollClient';
import ClientSearch from './ClientSearch';
import LandingPage from './LandingPage';
import DoctorRegister from './DoctorRegister';
import DoctorLogin from './DoctorLogin';
import MockDashboard from './MockDashboard';
import MockClients from './MockClients';
import MockPrograms from './MockPrograms';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<DoctorRegister />} />
        <Route path="/login" element={<DoctorLogin />} />
        <Route path="/clients" element={<ClientsList />} />
          <Route path="/programs" element={<Programs />} />

          <Route path="/mockdashboard" element={<MockDashboard />} />
          <Route path="/mockclients" element={<MockClients />} />
          <Route path="/mockprograms" element={<MockPrograms />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Homepage />} />
          
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/enroll/:id" element={<EnrollClient />} />
          <Route path="/clients/search" element={<ClientSearch />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
