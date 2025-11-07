// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaYoutube, FaFacebook } from 'react-icons/fa'; // Import social icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">&copy; {new Date().getFullYear()} MovieBooth.com. All rights reserved.</p>
          <div className="footer-icons">
            <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
              <FaGithub />
            </a>
            <a href="https://youtube.com/your-channel" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
              <FaYoutube />
            </a>
            <a href="https://facebook.com/your-page" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;