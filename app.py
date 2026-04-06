from flask import Flask, render_template, request
import tensorflow as tf
import cv2
import numpy as np
import os

app = Flask(__name__)

# ===== LOAD MODEL =====
model = tf.keras.models.load_model("Models/deepfake_model.h5")

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ===== IMAGE PREDICTION =====
def predict_image(path):
    img = cv2.imread(path)

    if img is None:
        return None, None

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img)[0][0]

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

        # Sample every 20th frame
        if frame_id % 20 == 0:
            frame = cv2.resize(frame, (224, 224))
            frame = frame / 255.0
            frame = np.expand_dims(frame, axis=0)

            pred = model.predict(frame)[0][0]

            if pred > 0.5:
                fake_count += 1
            else:
                real_count += 1

        frame_id += 1

    cap.release()

    total = fake_count + real_count

    if total == 0:
        return "ERROR", 0

    if fake_count > real_count:
        return "FAKE", fake_count / total
    else:
        return "REAL", real_count / total


# ===== ROUTE =====
@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    confidence = None
    file_path = None
    file_type = None

    if request.method == "POST":
        file = request.files.get("file")

        if file and file.filename != "":
            filename = file.filename.replace(" ", "_")
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)

            print("Saved file:", path)

            ext = filename.split(".")[-1].lower()

            # IMAGE
            if ext in ["jpg", "jpeg", "png"]:
                result, confidence = predict_image(path)
                file_type = "image"

            # VIDEO
            elif ext in ["mp4", "avi", "mov"]:
                result, confidence = predict_video(path)
                file_type = "video"

            else:
                return "❌ Unsupported file format"

            file_path = path

    return render_template(
        "index.html",
        result=result,
        confidence=confidence,
        file=file_path,
        file_type=file_type
    )


if __name__ == "__main__":
    app.run(debug=True)