from deepface import DeepFace
import cv2
import json

# Załaduj kamerę
cap = cv2.VideoCapture(0)
ret, frame = cap.read()
cap.release()

if ret:
    # Analiza emocji
    result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
    dominant_emotion = result[0]['dominant_emotion']
    print(json.dumps({'emotion': dominant_emotion}))
else:
    print(json.dumps({'error': 'Camera error'}))
