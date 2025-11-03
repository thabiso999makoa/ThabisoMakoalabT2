// src/components/Register.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import auth
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in Firestore under a 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        // Add other user fields here if needed (e.g., displayName)
      });

      alert('Registration successful!');
      navigate('/'); // Redirect to home after registration
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="login-register-bg">
      <div className="login-register-form">
        <h2>Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        <div className="link-between">
          <p>Already have an account? <a href="/login" className="btn btn-link-between">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;