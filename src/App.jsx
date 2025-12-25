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
import { detectMiniAppHost, initMiniApp } from "./utils/miniAppDetector.js";

import { supabase } from "./supabase.js";
import SupabaseTestConnection from "./components/SupabaseTestConnection.jsx";

function App() {
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [telegramData, setTelegramData] = useState(null);

  useEffect(() => {
    FontManager.initialize();

    if (localStorage.getItem("hasSeenIntro") === "true") {
      setShowIntroSlides(false);
    }

    const saveEitaaUser = async () => {
      const host = detectMiniAppHost();

      if (host !== "eitaa") {
        console.log("Not in Eitaa Mini App - host detected:", host);
        return;
      }

      console.log("Eitaa user detected, initializing...");

      try {
        const { initialized, webApp } = await initMiniApp();

        if (!initialized || !webApp) {
          console.log("Failed to initialize Eitaa WebApp");
          return;
        }

        console.log("Eitaa WebApp initialized successfully");

        if (typeof webApp.ready === "function") {
          webApp.ready();
        }

        const eitaaUser = webApp.initDataUnsafe?.user;

        if (!eitaaUser?.id) {
          console.log("No Eitaa user ID found in initDataUnsafe");

          console.log(
            "Debug: Full initDataUnsafe object:",
            webApp.initDataUnsafe
          );
          console.log("Debug: User object:", eitaaUser);

          return;
        }

        const userId = eitaaUser.id.toString();
        console.log("Found Eitaa user ID:", userId);

        console.log("Debug: User object properties:", {
          id: eitaaUser.id,
          username: eitaaUser.username,
          first_name: eitaaUser.first_name,
          last_name: eitaaUser.last_name,
          language_code: eitaaUser.language_code,
          is_bot: eitaaUser.is_bot,
          allows_write_to_pm: eitaaUser.allows_write_to_pm,
        });

        const sessionKey = `eitaa_user_${userId}_session`;
        if (sessionStorage.getItem(sessionKey)) {
          console.log("User already processed in this session");
          return;
        }

        setTelegramData({
          id: userId,
          username: eitaaUser.username || "",
          firstName: eitaaUser.first_name || "",
          lastName: eitaaUser.last_name || "",
          languageCode: eitaaUser.language_code || "fa",
        });

        try {
          const userData = {
            user_id: userId,
            username: eitaaUser.username || null,
            first_name: eitaaUser.first_name || "",
            last_name: eitaaUser.last_name || "",
            language_code: eitaaUser.language_code || "fa",
            is_bot: eitaaUser.is_bot || false,
            allows_write_to_pm: eitaaUser.allows_write_to_pm || false,
            source: "eitaa",
            created_at: new Date().toISOString(),
            last_seen: new Date().toISOString(),
          };

          console.log("Saving user data:", userData);

          const { data, error } = await supabase
            .from("users")
            .upsert(userData, {
              onConflict: "user_id",
              ignoreDuplicates: false,
            })
            .select();

          if (error) {
            console.error("Error saving user:", error.message);

            if (error.code === "23505") {
              const { error: updateError } = await supabase
                .from("users")
                .update({
                  last_seen: new Date().toISOString(),
                  username: eitaaUser.username || null,
                  first_name: eitaaUser.first_name || "",
                  last_name: eitaaUser.last_name || "",
                })
                .eq("user_id", userId);

              if (updateError) {
                console.error("Error updating user:", updateError.message);
              } else {
                console.log("Existing user updated");
              }
            }
          } else {
            console.log("User saved/updated successfully:", data);
          }

          sessionStorage.setItem(sessionKey, "true");
        } catch (err) {
          console.error("Unexpected error in save:", err);
        }
      } catch (err) {
        console.error("Error in saveEitaaUser:", err);
      }
    };

    const host = detectMiniAppHost();
    if (host === "eitaa") {
      const timeout = setTimeout(() => {
        saveEitaaUser();
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("hasSeenIntro", "true");
    setShowIntroSlides(false);
  };
  {
    import.meta.env.DEV && <SupabaseTestConnection />;
  }
  return (
    <ThemeProvider>
      <ClickSoundProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <PoliticalTestApp
                    onIntroComplete={handleIntroComplete}
                    telegramUser={telegramData}
                  />
                  {!showIntroSlides && <BottomNavigation />}
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/test" element={<SupabaseTestConnection />} />
          </Routes>
        </BrowserRouter>
      </ClickSoundProvider>
    </ThemeProvider>
  );
}

export default App;
