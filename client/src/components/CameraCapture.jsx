import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { useState } from 'react';
//import axios from 'axios';

function CameraCapture() {
  const webcamRef = useRef(null);
  const [Odpowiedz, setOdpowiedz] = useState(''); 
  const [Emocja, setEmocja] = useState(''); 

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Base64 obrazek

    fetch('/analyze', {
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


      fetch('/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }), // Base64 obrazek
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Odpowiedź z serwera:', data);
          setOdpowiedz(data); 
          if (data.output) {
            const emotion = JSON.parse(data.output).emotion; 
            setEmocja(emotion); 
          }
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
      <p>Odpowiedź z serwera: </p>
      {Odpowiedz && (
        <p>Dominująca emocja: {Odpowiedz && JSON.parse(Odpowiedz.output).emotion}</p>
      )}
    </div>
  );
}

export default CameraCapture;