import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [flavors, setFlavors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/flavors/')
      .then(response => {
        setFlavors(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Ice Cream Flavors</h1>
      <ul>
        {flavors.map(flavor => (
          <li key={flavor.id}>{flavor.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
