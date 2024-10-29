import { useState, useEffect } from "react";
import HeaderMain from "./components/HeaderMain";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Search from "./components/Search";
import TextEditor from "./components/TextEditor";
import InputData from "./components/InputData";



function App() {
  return (
      <Router>
        <HeaderMain />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/text-editor" element={<TextEditor />} />
          <Route path="/data-entry" element={<InputData />} />
        </Routes>
      </Router>
  );
}

export default App;
