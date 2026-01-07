// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PoliticalTestApp from "./app/politicalTest/PoliticalTestApp.jsx";
import About from "./pages/About.jsx";
import Settings from "./pages/Settings.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx";
import { ThemeProvider } from "./providers/ThemeProvider";
import { FontManager } from "./utils/fontManager";
import "./styles/globals.css";
import { ClickSoundProvider } from "./providers/ClickSoundProvider";
import Terms from "./pages/Terms";
import appState from "./utils/appState";
import cacheManager from "./utils/cacheManager";
import Profile from "./pages/Profile.jsx";
import GetPage from "./pages/Get.jsx";
import ClickSpark from "@/components/ClickSpark";
import AdlyBanner from "@/components/AdlyBanner.jsx"

function App() {
  const [showIntroSlides, setShowIntroSlides] = useState(true);

  useEffect(() => {
    FontManager.initialize();

    const stats = cacheManager.getStats();
    console.log("Cache stats:", stats);

    cacheManager.autoCleanup();

    const unsubscribe = appState.subscribe((key, value) => {
      console.log(`App state updated: ${key}`, value);
    });

    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "true") {
      setShowIntroSlides(false);
    }

    return () => unsubscribe();
  }, []);

  const handleIntroComplete = () => {
    setShowIntroSlides(false);
  };

  return (
    <ThemeProvider>
      <ClickSoundProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <PoliticalTestApp onIntroComplete={handleIntroComplete} />
                  {!showIntroSlides && (
                    <>
                      <BottomNavigation />
                      <AdlyBanner />
                    </>
                  )}
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/get" element={<GetPage />} />
          </Routes>
        </BrowserRouter>
      </ClickSoundProvider>
    </ThemeProvider>
  );
}

export default App;
