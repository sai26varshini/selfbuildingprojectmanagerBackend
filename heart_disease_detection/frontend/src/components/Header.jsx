frontend/src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="App-header">
      <h1>Heart Disease Detection</h1>
      <nav>
        <ul>
          <li><a href="/predict">Predict</a></li>
          <li><a href="/data">Data</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
