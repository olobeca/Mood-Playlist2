import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import About from './pages/About'
import './App.css'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/about" element={<h1>About</h1>} />
        </Routes>


      </div>
    </>
  )
}

export default App
