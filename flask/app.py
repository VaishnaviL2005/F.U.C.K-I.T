from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load ML model
model = joblib.load('path/to/your_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Process input data for model (adjust as needed)
        features = data['features']
        prediction = model.predict([features]).tolist()  # Convert to list
        return jsonify({'prediction': prediction[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)