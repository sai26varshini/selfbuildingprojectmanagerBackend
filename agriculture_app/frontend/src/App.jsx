import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:8000/crops');
        setCrops(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCrops();
  }, []);

  return (
    <div>
      <h1>Agriculture App</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {crops.map((crop) => (
            <li key={crop.id}>{crop.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
