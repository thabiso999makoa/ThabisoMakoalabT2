// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import custom CSS
import Home from './components/Home';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import AddReview from './components/AddReview';
import EditReview from './components/EditReview';
import Login from './components/Login';
import Register from './components/Register';
// import SuggestedMovies from './components/SuggestedMovies'; // Remove this import
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// Wrapper component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarPaths = ['/login', '/register'];

  return (
    <div className="d-flex flex-column min-vh-100">
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/add-review" element={<AddReview />} />
            <Route path="/edit-review/:id" element={<EditReview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Remove the /suggested-movies route */}
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;