// src/components/AddReview.jsx
import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth'; // Import auth state listener

const AddReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    movieId: '',
    movieTitle: '',
    userName: '', // This will be filled from auth state
    rating: 5,
    reviewText: '',
  });
  const [userId, setUserId] = useState(null); // Store user ID
  const [loading, setLoading] = useState(true); // Wait for auth state

  useEffect(() => {
    if (location.state && location.state.movieId && location.state.movieTitle) {
      setFormData(prev => ({
        ...prev,
        movieId: location.state.movieId,
        movieTitle: location.state.movieTitle,
      }));
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setFormData(prev => ({ ...prev, userName: user.email.split('@')[0] })); // Use email prefix as name
      } else {
        alert('You must be logged in to add a review.');
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        movieId: formData.movieId,
        movieTitle: formData.movieTitle,
        rating: parseInt(formData.rating),
        reviewText: formData.reviewText,
        userName: formData.userName,
        userId: userId, // Include the authenticated user's ID
        createdAt: new Date().toISOString(),
      });
      alert('Review added successfully!');
      navigate(`/movie/${formData.movieId}`);
    } catch (err) {
      console.error('Failed to add review:', err);
      alert('Failed to submit review');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Add a Review for {formData.movieTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Movie Title</label>
          <input type="text" className="form-control" name="movieTitle" value={formData.movieTitle} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Your Name (from email)</label>
          <input type="text" className="form-control" name="userName" value={formData.userName} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating (1-10)</label>
          <input
            type="number"
            className="form-control"
            name="rating"
            min="1"
            max="10"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Review</label>
          <textarea
            className="form-control"
            name="reviewText"
            rows="5"
            value={formData.reviewText}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;