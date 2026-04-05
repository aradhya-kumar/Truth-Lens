import tensorflow as tf
import cv2
import numpy as np

# Load model
model = tf.keras.models.load_model("Models/deepfake_model.h5")

# Load image
img_path = "C:\\Users\\Aradhya Kumar Rao\\Downloads\\WhatsApp Image 2026-04-04 at 01.22.25.jpeg"  # change this
img = cv2.imread(img_path)
img = cv2.resize(img, (224, 224))
img = img / 255.0

img = np.expand_dims(img, axis=0)

# Predict
prediction = model.predict(img)[0][0]

if prediction > 0.5:
    print(f"FAKE ({prediction:.2f})")
else:
    print(f"REAL ({1-prediction:.2f})")