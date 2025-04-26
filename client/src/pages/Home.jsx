import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "../components/CameraCapture";

function Home() {

    return (
        <>
        <div>
            <h1>Home</h1>
            <CameraCapture/>


        </div>
        </>

    )
} 
export default Home;