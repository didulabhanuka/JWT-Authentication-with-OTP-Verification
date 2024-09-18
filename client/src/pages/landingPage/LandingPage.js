import React, { useState, useEffect } from 'react';
import AuthModal from '../../components/authModal/authModal';

const LandingPage = () => {
  return (
    <div className="d-flex vh-100 align-items-center justify-content-center">
      <div className="text-center">
        <h1>Welcome to Our Website</h1>
        <p className="lead">This is a simple landing page built with React and Bootstrap.</p>
        <AuthModal/>
        
      </div>
    </div>
  );
};

export default LandingPage;
