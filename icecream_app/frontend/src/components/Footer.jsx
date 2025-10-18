frontend/src/components/Footer.jsx
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <p>&copy; {currentYear} Ice Cream App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
