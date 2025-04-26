import React, { useRef } from 'react';
import Webcam from 'react-webcam';
//import axios from 'axios';

function CameraCapture() {
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Base64 obrazek
    //await axios.post('http://localhost:8000/analyze', { image: imageSrc });
    // Wysyłanie zdjęcia do backendu
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