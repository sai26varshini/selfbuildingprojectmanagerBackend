import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/crops')
      .then(response => {
        setCrops(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Agriculture App</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {crops.map((crop, index) => (
            <li key={index}>{crop.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
