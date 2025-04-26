from deepface import DeepFace
import cv2
import json
import sys
import base64
import numpy as np

if len(sys.argv) < 2:
    print(json.dumps({'error': 'No image provided'}))
    sys.exit(1)

image_base64 = sys.argv[1]

try:
    image_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
    dominant_emotion = result[0]['dominant_emotion']
    print(json.dumps({'emotion': dominant_emotion}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
    sys.exit(1)