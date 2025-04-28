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

#with open('input.txt', 'r') as file:
 #   image_base64 = file.read()

try:
    image_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = DeepFace.analyze(
        frame, 
        actions=['emotion', 'age', 'race'], 
        enforce_detection=False
    )
    
    data = result[0]
    dominant_emotion = data['dominant_emotion']
    dominant_age = data['age']
    #dominant_gender = data['gender']
    dominant_race = data['dominant_race']


    print(json.dumps({'emotion': dominant_emotion ,
                      'age': dominant_age,
                     #'gender': dominant_gender,
                     'race': dominant_race
                      }))
except Exception as e:
    #print(json.dumps({'error': str(e)}))
    print(json.dumps({'error': f'Błąd: {str(e)}'}))
    sys.exit(1)