// frontend/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-facebook" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-twitter" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-instagram" />
              </a>
            </div>
            <p>&copy; 2023 Anshu Soap. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
