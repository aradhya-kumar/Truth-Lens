from flask import Flask, render_template, request
import tensorflow as tf
import cv2
import numpy as np
import os

app = Flask(__name__)

# ===== LOAD MODEL =====
model = tf.keras.models.load_model("Models/deepfake_model.h5")

# ===== UPLOAD FOLDER =====
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    confidence = None
    image_path = None

    if request.method == "POST":
        file = request.files.get("file")

        if file and file.filename != "":
            # Fix filename (remove spaces)
            filename = file.filename.replace(" ", "_")
            path = os.path.join(UPLOAD_FOLDER, filename)

            # Save file
            file.save(path)
            print("Saved file:", path)

            # Read image
            img = cv2.imread(path)

            # 🔥 ERROR FIX (VERY IMPORTANT)
            if img is None:
                return "❌ Error: Image not loaded. Please upload a JPG or PNG file."

            # Preprocess
            img = cv2.resize(img, (224, 224))
            img = img / 255.0
            img = np.expand_dims(img, axis=0)

            # Predict
            prediction = model.predict(img)[0][0]

            if prediction > 0.5:
                result = "FAKE"
                confidence = float(prediction)
            else:
                result = "REAL"
                confidence = float(1 - prediction)

            image_path = path

    return render_template(
        "index.html",
        result=result,
        confidence=confidence,
        image=image_path
    )


if __name__ == "__main__":
    app.run(debug=True)