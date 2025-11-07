// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaSignInAlt, FaUserPlus, FaBars, FaSignOutAlt } from 'react-icons/fa'; // Removed FaStar
import { auth } from '../firebase'; // Import auth
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      navigate('/login'); // Redirect to login after logout
    } catch (err) {
      console.error('Logout error:', err);
      alert('Failed to log out');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand text-danger" to="/">
          <FaHome className="me-2" /> MovieBooth
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/" onClick={closeDropdown}> {/* Close dropdown on nav click */}
                <FaHome className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/movies" onClick={closeDropdown}>
                <FaSearch className="me-1" /> Search Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/add-review" onClick={closeDropdown}>
                <FaPlus className="me-1" /> Add Review
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {/* Show Login/Register buttons if not logged in */}
            {!currentUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login" onClick={closeDropdown}>
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register" onClick={closeDropdown}>
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}

            {/* Show User Menu Dropdown if logged in */}
            {currentUser && (
              <li className="nav-item dropdown position-relative"> {/* Add position-relative */}
                <button
                  className="nav-link dropdown-toggle text-white bg-transparent border-0 d-flex align-items-center"
                  type="button"
                  id="userMenuDropdown"
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen} // Set aria-expanded based on state
                >
                  <FaBars className="me-1" /> {/* Menu icon */}
                  <span className="ms-1">{currentUser.email.split('@')[0]}</span> {/* Show user name */}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} // Add 'show' class based on state
                  aria-labelledby="userMenuDropdown"
                  style={{ display: dropdownOpen ? 'block' : 'none' }} // Ensure display is controlled
                >
                  {/* Removed Suggested Movies link */}
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Log Out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;