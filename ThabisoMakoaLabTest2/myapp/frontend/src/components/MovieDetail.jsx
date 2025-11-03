// src/components/MovieDetail.jsx
import React, { useState, useEffect } from 'react';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db, auth } from '../firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth'; // Import auth state listener

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Store current user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const fetchData = async () => {
      try {
        const movieResponse = await axios.get(`http://localhost:5000/movie/${id}`);
        setMovie(movieResponse.data);

        const q = query(collection(db, 'reviews'), where('movieId', '==', id));
        const querySnapshot = await getDocs(q);
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        alert('Failed to load movie details or reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => unsubscribe(); // Clean up listener
  }, [id]);

  const handleEditClick = (review) => {
    // Check if the current user is the owner of the review
    if (currentUser && review.userId === currentUser.uid) {
        navigate(`/edit-review/${review.id}`, { state: { review } });
    } else {
        alert('You can only edit your own reviews.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div>
      <h2>{movie.Title}</h2>
      {movie.Poster !== "N/A" ? (
        <img src={movie.Poster} alt={movie.Title} className="img-fluid mb-3" />
      ) : (
        <div className="bg-light d-flex align-items-center justify-content-center mb-3" style={{ height: '400px' }}>
          <span>No Image</span>
        </div>
      )}
      <p><strong>Year:</strong> {movie.Year}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Plot:</strong> {movie.Plot}</p>

      <h3 className="mt-4">Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <h5>{review.userName}</h5>
              <p>Rating: {review.rating}/10</p>
              <p>{review.reviewText}</p>
              {/* Show Edit button only if the review belongs to the current user */}
              {currentUser && review.userId === currentUser.uid && (
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditClick(review)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first!</p>
      )}

      {/* Only show Add Review link if user is logged in */}
      {currentUser ? (
        <Link to="/add-review" state={{ movieId: id, movieTitle: movie.Title }} className="btn btn-success">
          Add Your Review
        </Link>
      ) : (
        <p className="mt-3 movie-detail-login-prompt">
          Please <Link to="/login">log in</Link> to add a review.
        </p>
      )}
    </div>
  );
};

export default MovieDetail;