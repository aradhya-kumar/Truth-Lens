import cv2
import os

def extract_frames(video_path, output_folder):
    cap = cv2.VideoCapture(video_path)
    frame_id = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id % 10 == 0:  
            frame = cv2.resize(frame, (224,224))
            cv2.imwrite(f"{output_folder}/frame_{frame_id}.jpg", frame)

        frame_id += 1

    cap.release()