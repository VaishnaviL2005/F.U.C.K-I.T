from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows requests from Next.js frontend (avoid CORS issues)

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    print("Received from frontend:", data)
    response = {"message": "Data received", "echo": data}
    return jsonify(response)

@app.route('/api/data', methods=['GET'])
def send_data():
    data_to_send = {"message": "Hello from Flask!", "value": 42}
    return jsonify(data_to_send)

if __name__ == '__main__':
    app.run(debug=True)
