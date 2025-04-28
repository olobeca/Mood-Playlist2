import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 


function About() {
    return (
        <>
        <div>
            <h1>About</h1>
            <p>Welcome to the about page!</p>
            <p>This application uses a webcam to capture images and analyze them using a Python backend.</p>
            <p>It can detect emotions and suggest playlists based on the detected emotion.</p>
            <p>To use the application, navigate to the home page and capture an image using the webcam.</p>
            <p>The application will then analyze the image and provide you with a list of playlists that match your mood.</p>
            <p>Enjoy your music!</p>
            <p>Created by Aleksander Radecki</p>
        </div>
        </>
    )
}
export default About;