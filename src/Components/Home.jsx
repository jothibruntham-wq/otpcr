import React, { useState, useEffect, useRef } from 'react';
import '../assets/style/style.css';

export default function Home() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('----');
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Generate dynamic 4-digit OTP
  const generateDynamicOTP = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtp(['', '', '', '']);
    setIsVerified(false);
    setHasError(false);
    setTimeout(() => {
      inputRefs[0]?.current?.focus();
    }, 50);
  };

  useEffect(() => {
    generateDynamicOTP();
  }, []);

  // Handle single character change
  const handleChange = (value, index) => {
    const cleanValue = value.replace(/[^1-9]/g, '');
    const newOtp = [...otp];

    if (cleanValue.length > 1) {
      newOtp[index] = cleanValue.slice(-1);
    } else {
      newOtp[index] = cleanValue;
    }

    setOtp(newOtp);
    setHasError(false);

    // Auto-advance to next input after entering an integer
    if (cleanValue && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1]?.current?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  // Paste 4-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    const numericData = pasteData.replace(/[^0-9]/g, '').slice(0, 4);
    if (!numericData) return;

    const newOtp = ['', '', '', ''];
    for (let i = 0; i < numericData.length; i++) {
      newOtp[i] = numericData[i];
    }
    setOtp(newOtp);
    setHasError(false);

    const targetIdx = Math.min(numericData.length, 3);
    inputRefs[targetIdx]?.current?.focus();
  };

  // Verify entered code
  useEffect(() => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      if (enteredOtp === generatedOtp) {
        setTimeout(() => {
          setIsVerified(true);
        }, 350);
      } else {
        setHasError(true);
        setTimeout(() => {
          alert('Incorrect OTP! Please check the number in the message.');
          setOtp(['', '', '', '']);
          setHasError(false);
          inputRefs[0]?.current?.focus();
        }, 300);
      }
    }
  }, [otp, generatedOtp]);

  // Fill generated code
  const handleFillCode = () => {
    if (generatedOtp && generatedOtp !== '----') {
      setOtp(generatedOtp.split(''));
      setHasError(false);
    }
  };

  return (
    <div className="otp-page">
      {/* Ambient Neon Blobs for Frosted Glass Effect */}
      <div className="neon-blob blob-purple" />
      <div className="neon-blob blob-orange" />

      <h1 className="main-title">OTP VERIFICATION</h1>

      {!isVerified ? (
        <div className="glass-card">
          <div className="brand-name">Google</div>
          <h2 className="heading">ENTER PIN:</h2>
          <p className="subheading">Enter the 4-Digit Code...</p>

          {/* OTP Container with Underline effect after integer is entered */}
          <div className="otp-container" onPaste={handlePaste}>
            {otp.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`otp-box ${val ? 'filled' : ''} ${hasError ? 'error' : ''}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Glass Message Box displaying OTP */}
          <div className="message-box">
            <div>
              <div className="message-title">Message</div>
              <div className="message-text">
                GOOGLE Verification Code is <span className="bold-white">{generatedOtp}</span>
              </div>
            </div>
            <button
              type="button"
              className="neon-btn-orange"
              onClick={handleFillCode}
            >
              Fill Code
            </button>
          </div>
        </div>
      ) : (
        /* Verified Glass Success Card */
        <div className="glass-card">
          <div className="success-icon-container">
            <div className="success-glow">✓</div>
          </div>
          <h2 className="heading" style={{ marginBottom: '0.5rem' }}>
            Number Verified
          </h2>
          <p className="subheading" style={{ marginBottom: '2rem' }}>
            You are logged in on this device.
          </p>
          <button
            type="button"
            className="neon-btn-success"
            onClick={generateDynamicOTP}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}