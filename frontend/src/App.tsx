import './App.css';
import React, { useEffect, useState } from 'react';
import HomePage from "./components/HomePage"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        
        
        <BrowserRouter>
        <Logo />
          <Routes>
            <Route path="/" Component={HomePage} />
          </Routes>
        </BrowserRouter>
        
        
      </header>
    </div>
  );
}

function Logo() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/' && (
        <a href="/">
          <img src={""} alt="Logo" className="logo" />
        </a>
      )}
    </div>
  );
}


export default App;
