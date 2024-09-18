import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ history }) => {
  // State variables
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // Tracks if OTP has been sent
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Close alert after 5 seconds
  const handleAlertClose = () => {
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/auth/signin', { email, password });
      const { data } = response;

      // Store the JWT token or other user data in localStorage or state
      localStorage.setItem('userInfo', JSON.stringify(data));
      history.push('/');
    } catch (err) {
      setError(err.response?.data || "Login failed. Please try again.");
      handleAlertClose();
    }
  };

  // Handle register form submission (Step 1: Registration request, Step 2: OTP Verification)
  const submitHandler = async (e) => {
    e.preventDefault();

      // Step 1: Register and send OTP
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      const newUser = {
        name,
        email,
        contactNumber,
        password,
      };

      try {
        await axios.post('http://localhost:4000/api/auth/signup-request', newUser);
        setIsOtpSent(true); // Switch to OTP input form
        setError('OTP sent to your email. Please verify.');
        handleAlertClose();
      } catch (err) {
        setError(err.response?.data || "Registration failed. Please try again.");
        handleAlertClose();
      }
    };

    const verifyOtp = async (e) => {
      e.preventDefault()

      // Step 2: Verify OTP
      const userData = {
        email,
        otp,
        name,
        contactNumber,
        password,
      };

      try {
        await axios.post('http://localhost:4000/api/auth/signup-verify', userData);
        setError('Registration successful!');
        handleAlertClose();
        history.push('/'); // Redirect after successful registration
      } catch (err) {
        setError(err.response?.data || "OTP verification failed. Please try again.");
        console.log(err)
        handleAlertClose();
      }
    };

  // Open login modal
  const handleShowLoginModal = () => {
    setShowLoginModal(true);
    handleCloseRegisterModal();
  };

  // Close login modal
  const handleCloseLoginModal = () => setShowLoginModal(false);

  // Open register modal
  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
    handleCloseLoginModal();
  };

  // Close register modal
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  return (
    <>
      <button className="btn btn-outline-primary btn-lg" onClick={handleShowRegisterModal}>Get Started</button>

      {showLoginModal && (
        <div className="modal" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className='m-3 d-flex justify-content-end'>
                <button type="button" className="btn-close" onClick={handleCloseLoginModal}></button>
              </div>
              <div className="modal-body text-center">
                <h3 className="fw-bold mb-2 text-uppercase">Login</h3>
                <p className="text-dark mb-5">Please enter your login and password!</p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                    {handleAlertClose()}
                  </div>
                )}

                <div className='m-4'>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Password</label>
                  </div>
                </div>

                <button className="btn btn-outline-dark m-3" onClick={handleSubmit}>Login</button>

                <div className='m-3'>
                  <p className="mb-0">Don't have an account? <a className="text-dark fw-bold" onClick={handleShowRegisterModal}>Sign Up</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content p-3">
              <div className='m-3 d-flex justify-content-end'>
                <button type="button" className="btn-close" onClick={handleCloseRegisterModal}></button>
              </div>

              <div className="modal-body text-center">
                <h3 className="fw-bold mb-2 text-uppercase">Register</h3>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                    {handleAlertClose()}
                  </div>
                )}

                <div className='m-4'>
                  {/* Registration Form */}
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <label>Full name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Email address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="number" className="form-control" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                    <label>Contact Number</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Password</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <label>Confirm Password</label>
                  </div>

                  {/* OTP Input */}
                  {isOtpSent && (
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                      <label>Enter OTP</label>
                    </div>
                  )}
                </div>

                <button 
                  className="btn btn-outline-dark m-2" 
                  onClick={isOtpSent ? verifyOtp : submitHandler}
                >
                  {isOtpSent ? 'Verify OTP' : 'Register'}
                </button>


                <div className='m-3'>
                  <p className="mb-0">Already have an account? <a className="text-dark fw-bold" onClick={handleShowLoginModal}>Sign In</a></p>
                </div>
              </div>

              <div className="modal-footer justify-content-start">
                <p><small>*For the testing purposes only</small></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
