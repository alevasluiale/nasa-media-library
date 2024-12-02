import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { ShowPage } from "./pages/ShowPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/show/:id" element={<ShowPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
