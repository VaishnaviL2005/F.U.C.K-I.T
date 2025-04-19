"use client"


import { useState, FormEvent } from 'react';

interface PredictionResponse {
  prediction: number | string;
  error?: string;
}

export default function PredictionForm() {
  const [input, setInput] = useState<string>('');
  const [prediction, setPrediction] = useState<number | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Convert input to numeric array
      const features = input.split(',').map(Number);
      
      // Validate input
      if (features.some(isNaN)) {
        throw new Error('Invalid input - please enter comma-separated numbers');
      }

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        const errorData: PredictionResponse = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setPrediction(null);
    }
  };

  return (
    <div className="prediction-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter features (comma-separated)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Predict
        </button>
      </form>

      {error && <div className="error-message">Error: {error}</div>}
      {prediction !== null && (
        <div className="prediction-result">
          Prediction: {typeof prediction === 'number' ? prediction.toFixed(2) : prediction}
        </div>
      )}
    </div>
  );
}