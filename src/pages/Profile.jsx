import React, { useState, useEffect } from "react";
import { initMiniApp, detectMiniAppHost } from "../utils/miniAppDetector";
import {
  Calendar,
  CheckCircle,
  Globe,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  User,
  Shield,
  Home,
  Wifi,
  WifiOff,
} from "lucide-react";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";
import AdvancedBottomNavigation from "../components/BottomNavigation";

const Profile = () => {
  const [user, setUser] = useState({
    name: "کاربر عزیز",
    email: "",
    phone: "",
    bio: "",
    username: "",
    userId: "",
    platform: "web",
  });

  const [miniAppUser, setMiniAppUser] = useState(null);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [miniAppHost, setMiniAppHost] = useState(null);
  const [miniAppData, setMiniAppData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [joinDays, setJoinDays] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeMiniApp();
    calculateJoinDays();
    checkOnlineStatus();
  }, []);

  const checkOnlineStatus = () => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  };

  const initializeMiniApp = async () => {
    try {
      setIsLoading(true);
      const { host, initialized, webApp } = await initMiniApp();

      if (initialized && webApp) {
        setIsMiniApp(true);
        setMiniAppHost(host);
        setMiniAppData(webApp);

        let userData = {};
        let userImg = null;
        let userId = "";
        let username = "";

        // Handle Telegram
        if (host === "telegram" && webApp.initDataUnsafe?.user) {
          const tgUser = webApp.initDataUnsafe.user;
          setMiniAppUser(tgUser);

          userId = tgUser.id?.toString() || "";
          username = tgUser.username || "";

          userData = {
            name:
              `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() ||
              "کاربر تلگرام",
            email: tgUser.email || "",
            phone: tgUser.phone || "",
            bio: username ? `@${username}` : "کاربر تلگرام",
            username: username,
            userId: userId,
            platform: "telegram",
          };

          if (tgUser.photo_url) {
            userImg = tgUser.photo_url;
          }

          saveUserData("telegram", userId, userData, userImg);
        }
        // Handle Eitaa with SDK
        else if (host === "eitaa" && window.Eitaa?.WebApp) {
          try {
            // استفاده از SDK ایتا برای گرفتن اطلاعات کاربر
            const eitaaUser = window.Eitaa.WebApp.initDataUnsafe?.user;

            if (eitaaUser) {
              setMiniAppUser(eitaaUser);

              userId = eitaaUser.id?.toString() || "";
              username = eitaaUser.username || "";

              userData = {
                name:
                  `${eitaaUser.first_name || ""} ${
                    eitaaUser.last_name || ""
                  }`.trim() || "کاربر ایتا",
                email: "",
                phone: "",
                bio: username ? `@${username}` : "کاربر ایتا",
                username: username,
                userId: userId,
                platform: "eitaa",
              };

              // گرفتن عکس پروفایل از ایتا
              if (eitaaUser.photo_url) {
                userImg = eitaaUser.photo_url;
              }

              saveUserData("eitaa", userId, userData, userImg);
            }
          } catch (eitaaError) {
            console.error("Eitaa SDK error:", eitaaError);
            // Fallback to localStorage
            loadFromLocalStorage(host);
          }
        }

        if (Object.keys(userData).length > 0) {
          setUser(userData);
          if (userImg) {
            setUserImage(userImg);
          }
        } else {
          loadFromLocalStorage(host);
        }
      } else {
        const host = detectMiniAppHost();
        loadFromLocalStorage(host);
      }
    } catch (error) {
      console.error("Mini app initialization error:", error);
      loadFromLocalStorage("web");
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = (platform, userId, userData, userImg) => {
    const storageKey = `${platform}_${userId}`;

    try {
      localStorage.setItem(`${storageKey}_joined`, new Date().toISOString());
      localStorage.setItem(`${storageKey}_data`, JSON.stringify(userData));

      if (userImg) {
        localStorage.setItem(`${storageKey}_image`, userImg);
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const loadFromLocalStorage = (host) => {
    if (host !== "unknown" && host !== "web") {
      const keys = Object.keys(localStorage);
      const storageKey = keys.find(
        (key) => key.startsWith(`${host}_`) && key.endsWith("_joined")
      );

      if (storageKey) {
        const userId = storageKey.split("_")[1];
        const savedData = localStorage.getItem(`${host}_${userId}_data`);
        const savedImage = localStorage.getItem(`${host}_${userId}_image`);

        if (savedData) {
          try {
            const parsedUser = JSON.parse(savedData);
            setUser(parsedUser);
          } catch (error) {
            console.error("Failed to parse user data:", error);
          }
        }

        if (savedImage) {
          setUserImage(savedImage);
        }
        return;
      }
    }

    // Fallback to general saved profile
    const generalSaved = localStorage.getItem("user_profile");
    if (generalSaved) {
      try {
        const parsedUser = JSON.parse(generalSaved);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse general profile:", error);
      }
    }
  };

  const calculateJoinDays = () => {
    const host = detectMiniAppHost();
    let joinDateStr = null;
    let storageKey = null;

    if (host !== "unknown") {
      const keys = Object.keys(localStorage);
      const foundKey = keys.find(
        (key) => key.startsWith(`${host}_`) && key.endsWith("_joined")
      );

      if (foundKey) {
        storageKey = foundKey;
        joinDateStr = localStorage.getItem(foundKey);
      }
    }

    if (!joinDateStr) {
      joinDateStr = localStorage.getItem("user_joined");
    }

    if (joinDateStr) {
      try {
        const joinDate = new Date(joinDateStr);
        const today = new Date();
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setJoinDays(diffDays);
      } catch (error) {
        console.error("Failed to calculate join days:", error);
        setJoinDays(0);
      }
    } else {
      const today = new Date().toISOString();
      if (storageKey) {
        localStorage.setItem(storageKey, today);
      } else {
        localStorage.setItem("user_joined", today);
      }
      setJoinDays(0);
    }
  };

  const getPlatformName = () => {
    if (miniAppHost === "telegram") return "تلگرام";
    if (miniAppHost === "eitaa") return "ایتا";
    return "وب";
  };

  const PlatformIconSVG = () => {
    if (miniAppHost === "telegram") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.509l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.05 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.196 1.006.128.832.941z" />
        </svg>
      );
    } else if (miniAppHost === "eitaa") {
      return (
        <svg
          fill="#ff8040"
          width="64px"
          height="64px"
          viewBox="0 0 24 24"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M5.968 23.942a6.624 6.624 0 0 1-2.332-.83c-1.62-.929-2.829-2.593-3.217-4.426-.151-.717-.17-1.623-.15-7.207C.288 5.47.274 5.78.56 4.79c.142-.493.537-1.34.823-1.767C2.438 1.453 3.99.445 5.913.08c.384-.073.94-.08 6.056-.08 6.251 0 6.045-.009 7.066.314a6.807 6.807 0 0 1 4.314 4.184c.33.937.346 1.087.369 3.555l.02 2.23-.391.268c-.558.381-1.29 1.06-2.316 2.15-1.182 1.256-2.376 2.42-2.982 2.907-1.309 1.051-2.508 1.651-3.726 1.864-.634.11-1.682.067-2.302-.095-.553-.144-.517-.168-.726.464a6.355 6.355 0 0 0-.318 1.546l-.031.407-.146-.03c-1.215-.241-2.419-1.285-2.884-2.5a3.583 3.583 0 0 1-.26-1.219l-.016-.34-.309-.284c-.644-.59-1.063-1.312-1.195-2.061-.212-1.193.34-2.542 1.538-3.756 1.264-1.283 3.127-2.29 4.953-2.68.658-.14 1.818-.177 2.403-.075 1.138.198 2.067.773 2.645 1.639.182.271.195.31.177.555a.812.812 0 0 1-.183.493c-.465.651-1.848 1.348-3.336 1.68-2.625.585-4.294-.142-4.033-1.759.026-.163.04-.304.031-.313-.032-.032-.293.104-.575.3-.479.334-.903.984-1.05 1.607-.036.156-.05.406-.034.65.02.331.053.454.192.736.092.186.275.45.408.589l.24.251-.096.122a4.845 4.845 0 0 0-.677 1.217 3.635 3.635 0 0 0-.105 1.815c.103.461.421 1.095.739 1.468.242.285.797.764.886.764.024 0 .044-.048.044-.106.001-.23.184-.973.326-1.327.423-1.058 1.351-1.96 2.82-2.74.245-.13.952-.47 1.572-.757 1.36-.63 2.103-1.015 2.511-1.305 1.176-.833 1.903-2.065 2.14-3.625.086-.57.086-1.634 0-2.207-.368-2.438-2.195-4.096-4.818-4.37-2.925-.307-6.648 1.953-8.942 5.427-1.116 1.69-1.87 3.565-2.187 5.443-.123.728-.169 2.08-.093 2.75.193 1.704.822 3.078 1.903 4.156a6.531 6.531 0 0 0 1.87 1.313c2.368 1.13 4.99 1.155 7.295.071.996-.469 1.974-1.196 3.023-2.25 1.02-1.025 1.71-1.88 3.592-4.458 1.04-1.423 1.864-2.368 2.272-2.605l.15-.086-.019 3.091c-.018 2.993-.022 3.107-.123 3.561-.6 2.678-2.54 4.636-5.195 5.242l-.468.107-5.775.01c-4.734.008-5.85-.002-6.19-.056z"></path>
          </g>
        </svg>
      );
    }
    return <Globe size={24} />;
  };

  const getInitials = () => {
    if (miniAppUser) {
      if (miniAppHost === "telegram" || miniAppHost === "eitaa") {
        const first = miniAppUser.first_name?.[0] || "";
        const last = miniAppUser.last_name?.[0] || "";
        const initials = (first + last).toUpperCase();
        return initials || (miniAppHost === "telegram" ? "TG" : "ET");
      }
    }

    const nameParts = user.name.split(" ").filter(Boolean);
    if (nameParts.length > 0) {
      return nameParts
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    return "U";
  };

  const handleDeleteLocalData = () => {
    if (showConfirmModal) {
      try {
        const host = detectMiniAppHost();

        if (host !== "unknown") {
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            if (key.startsWith(`${host}_`)) {
              localStorage.removeItem(key);
            }
          });
        }

        // Clear general data
        localStorage.removeItem("user_profile");
        localStorage.removeItem("user_joined");
        localStorage.removeItem("quiz_answers");
        localStorage.removeItem("quiz_results");

        const defaultUser = {
          name: "کاربر عزیز",
          email: "",
          phone: "",
          bio: "",
          username: "",
          userId: "",
          platform: "web",
        };

        setUser(defaultUser);
        setUserImage(null);
        setJoinDays(0);
        setShowConfirmModal(false);

        // Show notification
        if (isMiniApp && miniAppData) {
          if (miniAppHost === "telegram" && miniAppData.showPopup) {
            miniAppData.showPopup({
              title: "حذف شد",
              message: "اطلاعات این دستگاه با موفقیت حذف شد",
              buttons: [{ type: "ok" }],
            });
          } else if (miniAppHost === "eitaa" && miniAppData.showAlert) {
            miniAppData.showAlert("اطلاعات این دستگاه با موفقیت حذف شد");
          }
        } else {
          alert("✅ اطلاعات این دستگاه با موفقیت حذف شد");
        }
      } catch (error) {
        console.error("Failed to delete data:", error);
        alert("❌ خطا در حذف اطلاعات");
      }
    }
  };

  const handleBackToApp = () => {
    if (isMiniApp && miniAppData && typeof miniAppData.close === "function") {
      miniAppData.close();
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="container">
          <div className="profile-container">
            <div className="profile-header">
              <h1 className="profile-title">در حال بارگذاری...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="profile-page-wrapper">
          <div className="profile-page">
            <div className="profile-container">
              <div className="profile-header">
                <h1 className="profile-title">پروفایل</h1>
                <p className="profile-subtitle">
                  {user.username ? `@${user.username}` : "حساب کاربری شما"}
                </p>
              </div>

              <div className="profile-content">
                <div className="profile-section">
                  <div className="profile-image-wrapper">
                    <div className="profile-image-container">
                      <div className="profile-image">
                        {userImage ? (
                          <>
                            <img
                              src={userImage}
                              alt={user.name}
                              className="profile-avatar"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                  "flex";
                              }}
                            />
                            <span
                              className="profile-initials"
                              style={{ display: "none" }}
                            >
                              {getInitials()}
                            </span>
                          </>
                        ) : (
                          <span className="profile-initials">
                            {getInitials()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="platform-display">
                      <div className="platform-icon">
                        <PlatformIconSVG />
                      </div>
                      <span className="platform-name">{getPlatformName()}</span>
                    </div>

                    <h2 className="user-name">{user.name}</h2>
                  </div>
                </div>

                <div className="info-section">
                  <div className="section-header">
                    <h3>اطلاعات</h3>
                    <p>جزئیات حساب کاربری</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <User size={14} />
                        نام
                      </div>
                      <div className="info-value">{user.name}</div>
                    </div>

                    {user.username && (
                      <div className="info-item">
                        <div className="info-label">
                          <User size={14} />
                          نام کاربری
                        </div>
                        <div className="info-value">@{user.username}</div>
                      </div>
                    )}

                    {user.userId && (
                      <div className="info-item">
                        <div className="info-label">
                          <Shield size={14} />
                          شناسه
                        </div>
                        <div className="info-value code">{user.userId}</div>
                      </div>
                    )}

                    {user.email && (
                      <div className="info-item">
                        <div className="info-label">
                          <Mail size={14} />
                          ایمیل
                        </div>
                        <div className="info-value">{user.email}</div>
                      </div>
                    )}

                    {user.phone && (
                      <div className="info-item">
                        <div className="info-label">
                          <Phone size={14} />
                          تلفن
                        </div>
                        <div className="info-value">{user.phone}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="stats-section">
                  <h3 className="stats-title">آمار</h3>

                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <Calendar size={20} />
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{joinDays}</div>
                        <div className="stat-label">روز</div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon">
                        {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">آنلاین</div>
                        <div className="stat-label">وضعیت</div>
                      </div>
                    </div>

                    <div className="stat-item">
                      <div className="stat-icon">
                        <PlatformIconSVG />
                      </div>
                      <div className="stat-content">
                        <div className="stat-number">{getPlatformName()}</div>
                        <div className="stat-label">پلتفرم</div>
                      </div>
                    </div>
                  </div>

                  <div className="connection-status">
                    <div className="status-dot online"></div>
                    <span>متصل</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="action-button danger"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    <Trash2 size={18} />
                    <span>حذف اطلاعات دستگاه</span>
                  </button>

                  <button
                    className="action-button secondary"
                    onClick={handleBackToApp}
                  >
                    {isMiniApp ? <ArrowLeft size={18} /> : <Home size={18} />}
                    <span>
                      {isMiniApp ? "بازگشت به برنامه" : "بازگشت به خانه"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showConfirmModal && (
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h3>حذف اطلاعات</h3>
                <p>
                  آیا مطمئن هستید که می‌خواهید تمام اطلاعات ذخیره‌شده روی این
                  دستگاه را حذف کنید؟ این عمل غیرقابل بازگشت است.
                </p>
                <div className="confirm-modal-buttons">
                  <button
                    className="confirm-modal-button confirm"
                    onClick={handleDeleteLocalData}
                  >
                    حذف اطلاعات
                  </button>
                  <button
                    className="confirm-modal-button cancel"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    لغو
                  </button>
                </div>
              </div>
            </div>
          )}
          <AdvancedBottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Profile;
