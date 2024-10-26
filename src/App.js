import { useState, useEffect } from "react";
import HeaderMain from "./components/HeaderMain";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Search from "./components/Search";



function App() {
  return (
      <Router>
        <HeaderMain />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
  );
}

export default App;
