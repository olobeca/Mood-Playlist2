import React, { useRef } from 'react';
import Webcam from 'react-webcam';
//import axios from 'axios';

function CameraCapture() {
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Base64 obrazek

    fetch('http://localhost:5001/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageSrc }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });


      fetch('http://localhost:5001/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }), // Base64 obrazek
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Odpowiedź z serwera:', data);
        })
        .catch((error) => {
          console.error('Błąd:', error);
        });
  };
    


  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Zrób zdjęcie i wyślij</button>
    </div>
  );
}

export default CameraCapture;