import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { useState } from 'react';
//import axios from 'axios';

function CameraCapture() {
  const webcamRef = useRef(null);
  const [Odpowiedz, setOdpowiedz] = useState(''); 
  const [Emocja, setEmocja] = useState(''); 
  const [Playlists, setPlaylists] = useState([]);
  const [Race, setRace] = useState(''); 
  const [Gender, setGender] = useState(''); 
  const [Age, setAge] = useState('');

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
          if (data.pythonOutput) {
            try {
            const emotion = JSON.parse(data.pythonOutput).emotion; 
            setEmocja(emotion); 
            const race = JSON.parse(data.pythonOutput).race;
            setRace(race); 
            const gender = JSON.parse(data.pythonOutput).gender;
            setGender(gender); 
            const age = JSON.parse(data.pythonOutput).age;
            setAge(age);
            } catch (error) {
              console.error('Błąd podczas parsowania odpowiedzi:', error);
            }
          } 
          if(data.playlists)
          {
            console.log('Playlisty:', data.playlists);
            setPlaylists(data.playlists);
          }
        })
        .catch((error) => {
          console.error('Błąd:', error);
        });

  };
   
    


  return (
    <div className="">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Zrób zdjęcie i wyślij</button>
      <p>Odpowiedź z serwera: </p>
      {Emocja && <p>Dominująca emocja: {Emocja}</p>}
      {Age && <p>Wiek: {Age}</p>}
      {Gender && <p>Pleć: {Gender}</p>}
      {Race && <p>Rasa: {Race}</p>}
      {Playlists && Playlists.length > 0 && (
      <div>
        {Playlists.map((playlist, index) => (
          <div key={index}>
          <p>Nazwa Playlisty: {playlist.name}</p>
            <p>Link: <a href={playlist.url} target="_blank" rel="noopener noreferrer">{playlist.url}</a></p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default CameraCapture;