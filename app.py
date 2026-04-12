from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    # ... your model inference logic ...
    return jsonify({"status": "REAL", "confidence": 0.95})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
