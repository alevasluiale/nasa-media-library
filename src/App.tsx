import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ShowPage from "./pages/ShowPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/show/:id" element={<ShowPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
