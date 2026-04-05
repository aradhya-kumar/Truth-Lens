import cv2
import os

# ===== PATHS =====
dataset_path = "Dataset"
output_path = "Frames"

# Create output folders
os.makedirs(os.path.join(output_path, "Real"), exist_ok=True)
os.makedirs(os.path.join(output_path, "Fake"), exist_ok=True)


def extract_frames(video_path, save_folder, max_frames=50):
    cap = cv2.VideoCapture(video_path)
    frame_id = 0
    saved = 0

    while True:
        ret, frame = cap.read()

        if not ret or saved >= max_frames:
            break

        if frame_id % 15 == 0:
            frame = cv2.resize(frame, (224, 224))

            filename = f"{os.path.basename(video_path)}_{saved}.jpg"
            cv2.imwrite(os.path.join(save_folder, filename), frame)

            saved += 1

        frame_id += 1

    cap.release()


# ===== REAL =====
print("Extracting REAL videos...")
real_path = os.path.join(dataset_path, "Real")

for video in os.listdir(real_path):
    if video.endswith(".mp4"):
        extract_frames(
            os.path.join(real_path, video),
            os.path.join(output_path, "Real")
        )


# ===== FAKE =====
print("Extracting FAKE videos...")
fake_path = os.path.join(dataset_path, "Fake")

for video in os.listdir(fake_path):
    if video.endswith(".mp4"):
        extract_frames(
            os.path.join(fake_path, video),
            os.path.join(output_path, "Fake")
        )


print("Frame extraction completed!")