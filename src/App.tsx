import { useState } from 'react'
import './App.css'


import { Routes, Route } from 'react-router-dom';
import { MainPage } from "./pages/MainPage/MainPage.tsx";
import { SearchPage } from "./pages/SearchPage/SearcPage.tsx";



function App() {

  

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}

export default App
