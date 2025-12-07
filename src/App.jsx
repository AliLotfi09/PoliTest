import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PoliticalTestApp from "./apps/politicalTest/PoliticalTestApp.jsx";
import About from "./pages/About.jsx";
import Settings from "./pages/Settings.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PoliticalTestApp />
              <BottomNavigation />
            </>
          }
        />
        <Route path="/test" element={<PoliticalTestApp />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
