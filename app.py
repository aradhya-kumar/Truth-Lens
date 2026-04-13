from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import cv2
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ===== CONFIG =====
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===== MEMORY STORAGE (for dashboard) =====
history = []

# ===== LOAD MODEL =====
model = tf.keras.models.load_model("Models/deepfake_model.h5")


# ===== IMAGE PREDICTION =====
def predict_image(path):
    img = cv2.imread(path)

    if img is None:
        return "ERROR", 0.0

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img, verbose=0)[0][0]

    if pred > 0.5:
        return "FAKE", float(pred)
    else:
        return "REAL", float(1 - pred)


# ===== VIDEO PREDICTION =====
def predict_video(path):
    cap = cv2.VideoCapture(path)

    fake_count = 0
    real_count = 0
    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % 20 == 0:
            frame = cv2.resize(frame, (224, 224))
            frame = frame / 255.0
            frame = np.expand_dims(frame, axis=0)

            pred = model.predict(frame, verbose=0)[0][0]

            if pred > 0.5:
                fake_count += 1
            else:
                real_count += 1

        frame_id += 1

    cap.release()

    total = fake_count + real_count

    if total == 0:
        return "ERROR", 0.0

    if fake_count > real_count:
        return "FAKE", fake_count / total
    else:
        return "REAL", real_count / total


# ===== HEALTH CHECK =====
@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "TruthLens Backend Running 🚀"})


# ===== MAIN PREDICT API =====
@app.route("/api/predict", methods=["POST"])
def api_predict():
    try:
        file = request.files.get("file")

        if not file or file.filename == "":
            return jsonify({"error": "No file uploaded"}), 400

        filename = file.filename.replace(" ", "_")
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        ext = filename.split(".")[-1].lower()

        if ext in ["jpg", "jpeg", "png"]:
            result, confidence = predict_image(path)
            file_type = "image"

        elif ext in ["mp4", "avi", "mov"]:
            result, confidence = predict_video(path)
            file_type = "video"

        else:
            return jsonify({"error": "Unsupported file type"}), 400

        # ===== SAVE TO HISTORY =====
        entry = {
            "file": filename,
            "type": file_type,
            "result": result,
            "confidence": round(confidence, 4),
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        history.insert(0, entry)  # latest first

        return jsonify(entry)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ===== HISTORY API =====
@app.route("/api/history", methods=["GET"])
def get_history():
    return jsonify(history)


# ===== OPTIONAL HTML ROUTE =====
@app.route("/", methods=["GET", "POST"])
def index():
    return "TruthLens Backend Running 🚀"


# ===== RUN =====
if __name__ == "__main__":
    app.run(debug=True)