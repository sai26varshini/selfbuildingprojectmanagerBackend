import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p>
              Agriculture App &copy; 2023
            </p>
            <p>
              <Link to="/">Home</Link>
              {' | '}
              <Link to="/about">About</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
