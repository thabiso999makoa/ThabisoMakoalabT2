// src/components/MovieList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/movies?title=${searchTerm}`);
      setMovies(res.data.Search || []);
    } catch (err) {
      alert('Error fetching movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Movies</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter movie title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={searchMovies} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {movies.length > 0 ? (
        <div className="row">
          {movies.map(movie => (
            <div key={movie.imdbID} className="col-md-4 mb-3">
              <div className="card">
                {movie.Poster !== "N/A" ? (
                  <img src={movie.Poster} alt={movie.Title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                ) : (
                  <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                    <span>No Image</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{movie.Title}</h5>
                  <p className="card-text">Year: {movie.Year}</p>
                  <Link to={`/movie/${movie.imdbID}`} className="btn btn-sm btn-info">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{loading ? 'Loading...' : 'Search for a movie above...'}</p>
      )}
    </div>
  );
};

export default MovieList;