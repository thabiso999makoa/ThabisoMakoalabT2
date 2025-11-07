// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth'; // Import auth state listener

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  return (
    <div>
      <h1 className="text-danger">Welcome to MovieBooth!</h1>
      <p>Your place to share movie reviews with the world.</p>
      {currentUser ? (
        <div>
          <p>Hello, {currentUser.email.split('@')[0]}!</p>
          <div className="mt-4">
            <Link to="/movies" className="btn btn-primary me-2">Search Movies</Link>
            <Link to="/add-review" className="btn btn-success">Add a Review</Link>
          </div>
        </div>
      ) : (
        <div>
          <p>Please log in to add or edit reviews.</p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-primary me-2">Login</Link>
            <Link to="/register" className="btn btn-success">Register</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;