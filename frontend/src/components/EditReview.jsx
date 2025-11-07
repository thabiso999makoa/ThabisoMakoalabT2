// src/components/EditReview.jsx
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const EditReview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        alert('You must be logged in to edit a review.');
        navigate('/login');
      }
    });

    // Fetch the review to edit
    const fetchReview = async () => {
      if (!id) return;

      try {
        const reviewDoc = await getDoc(doc(db, 'reviews', id));
        if (reviewDoc.exists()) {
          const data = reviewDoc.data();
          // Check if the current user is the owner of the review
          if (data.userId !== currentUserId) {
            alert('You can only edit your own reviews.');
            navigate(`/movie/${data.movieId}`);
            return;
          }
          setReview({ id: reviewDoc.id, ...data });
        } else {
          alert('Review not found.');
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to fetch review:', err);
        alert('Failed to load review');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) { // Only fetch if user is authenticated
      fetchReview();
    }

    return () => unsubscribe(); // Clean up listener
  }, [id, currentUserId, navigate]);

  const handleChange = (e) => {
    if (review) {
      setReview({ ...review, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review || !currentUserId || review.userId !== currentUserId) {
      alert('You can only edit your own reviews.');
      return;
    }

    try {
      const reviewDoc = doc(db, 'reviews', id);
      await updateDoc(reviewDoc, {
        rating: parseInt(review.rating),
        reviewText: review.reviewText,
        updatedAt: new Date().toISOString(),
      });
      alert('Review updated!');
      navigate(`/movie/${review.movieId}`);
    } catch (err) {
      console.error('Failed to update review:', err);
      alert('Failed to update review');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!review) return <p>Review not found or you do not have permission to edit it.</p>;

  return (
    <div>
      <h2>Edit Review for {review.movieTitle}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Your Name (from email)</label>
          <input
            type="text"
            className="form-control"
            name="userName"
            value={review.userName}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating (1-10)</label>
          <input
            type="number"
            className="form-control"
            name="rating"
            min="1"
            max="10"
            value={review.rating}
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
            value={review.reviewText}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-warning">Update Review</button>
      </form>
    </div>
  );
};

export default EditReview;