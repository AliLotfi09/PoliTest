// import React, { useState, useEffect } from "react";
// import { initMiniApp, detectMiniAppHost } from "../utils/miniAppDetector";
// import {
//   Calendar,
//   CheckCircle,
//   Globe,
//   Trash2,
//   ArrowLeft,
//   Mail,
//   Phone,
//   User,
//   Shield,
//   Home,
//   Wifi,
//   WifiOff
// } from "lucide-react";
// import "../styles/App.css";
// import { useNavigate } from "react-router-dom";
// import AdvancedBottomNavigation from "../components/BottomNavigation";

// const Profile = () => {
//   const [user, setUser] = useState({
//     name: "کاربر عزیز",
//     email: "",
//     phone: "",
//     bio: "",
//     username: "",
//     userId: "",
//     platform: "web",
//   });

//   const [miniAppUser, setMiniAppUser] = useState(null);
//   const [isMiniApp, setIsMiniApp] = useState(false);
//   const [miniAppHost, setMiniAppHost] = useState(null);
//   const [miniAppData, setMiniAppData] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [joinDays, setJoinDays] = useState(0);
//   const [isOnline, setIsOnline] = useState(true);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     initializeMiniApp();
//     calculateJoinDays();
//     checkOnlineStatus();
//   }, []);

//   const checkOnlineStatus = () => {
//     setIsOnline(navigator.onLine);
//     window.addEventListener("online", () => setIsOnline(true));
//     window.addEventListener("offline", () => setIsOnline(false));

//     return () => {
//       window.removeEventListener("online", () => setIsOnline(true));
//       window.removeEventListener("offline", () => setIsOnline(false));
//     };
//   };

//   const initializeMiniApp = async () => {
//     const { host, initialized, webApp } = await initMiniApp();

//     if (initialized && webApp) {
//       setIsMiniApp(true);
//       setMiniAppHost(host);
//       setMiniAppData(webApp);

//       let userData = {};
//       let userImg = null;
//       let userId = "";
//       let username = "";

//       if (host === "telegram" && webApp.initDataUnsafe?.user) {
//         const tgUser = webApp.initDataUnsafe.user;
//         setMiniAppUser(tgUser);

//         userId = tgUser.id?.toString() || "";
//         username = tgUser.username || "";

//         userData = {
//           name: `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() || "کاربر تلگرام",
//           email: tgUser.email || "",
//           phone: tgUser.phone || "",
//           bio: username ? `کاربر تلگرام` : "کاربر تلگرام",
//           username: username,
//           userId: userId,
//           platform: "telegram",
//         };

//         if (tgUser.photo_url) {
//           userImg = tgUser.photo_url;
//         }

//         const storageKey = `tg_${userId}`;
//         localStorage.setItem(`${storageKey}_joined`, new Date().toISOString());
//         localStorage.setItem(`${storageKey}_data`, JSON.stringify(userData));
//         if (userImg) {
//           localStorage.setItem(`${storageKey}_image`, userImg);
//         }
//       } 
//       else if (host === "eitaa" && webApp.initDataUnsafe?.user) {
//         const eitaaUser = webApp.initDataUnsafe.user;
//         setMiniAppUser(eitaaUser);

//         userId = eitaaUser.id?.toString() || "";
//         username = eitaaUser.username || "";

//         userData = {
//           name: `${eitaaUser.first_name || ""} ${eitaaUser.last_name || ""}`.trim() || "کاربر ایتا",
//           email: "",
//           phone: "",
//           bio: username ? `کاربر ایتا` : "کاربر ایتا",
//           username: username,
//           userId: userId,
//           platform: "eitaa",
//         };

//         if (eitaaUser.photo_url) {
//           userImg = eitaaUser.photo_url;
//         }

//         const storageKey = `eitaa_${userId}`;
//         localStorage.setItem(`${storageKey}_joined`, new Date().toISOString());
//         localStorage.setItem(`${storageKey}_data`, JSON.stringify(userData));
//         if (userImg) {
//           localStorage.setItem(`${storageKey}_image`, userImg);
//         }
//       }

//       if (Object.keys(userData).length > 0) {
//         setUser(userData);
//         if (userImg) {
//           setUserImage(userImg);
//         }
//       } else {
//         loadFromLocalStorage(host);
//       }
//     } else {
//       const host = detectMiniAppHost();
//       loadFromLocalStorage(host);
//     }
//   };

//   const loadFromLocalStorage = (host) => {
//     if (host !== "unknown") {
//       const keys = Object.keys(localStorage);
//       const storageKey = keys.find(
//         (key) => key.startsWith(`${host}_`) && key.endsWith("_joined")
//       );

//       if (storageKey) {
//         const userId = storageKey.split("_")[1];
//         const savedData = localStorage.getItem(`${host}_${userId}_data`);
//         const savedImage = localStorage.getItem(`${host}_${userId}_image`);

//         if (savedData) {
//           const parsedUser = JSON.parse(savedData);
//           setUser(parsedUser);
//         }

//         if (savedImage) {
//           setUserImage(savedImage);
//         }
//         return;
//       }
//     }

//     const generalSaved = localStorage.getItem("user_profile");
//     if (generalSaved) {
//       const parsedUser = JSON.parse(generalSaved);
//       setUser(parsedUser);
//     }
//   };

//   const calculateJoinDays = () => {
//     const host = detectMiniAppHost();
//     let joinDateStr = null;
//     let storageKey = null;

//     if (host !== "unknown") {
//       const keys = Object.keys(localStorage);
//       const foundKey = keys.find(
//         (key) => key.startsWith(`${host}_`) && key.endsWith("_joined")
//       );

//       if (foundKey) {
//         storageKey = foundKey;
//         joinDateStr = localStorage.getItem(foundKey);
//       }
//     }

//     if (!joinDateStr) {
//       joinDateStr = localStorage.getItem("user_joined");
//     }

//     if (joinDateStr) {
//       const joinDate = new Date(joinDateStr);
//       const today = new Date();
//       const diffTime = Math.abs(today - joinDate);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       setJoinDays(diffDays);
//     } else {
//       const today = new Date().toISOString();
//       if (storageKey) {
//         localStorage.setItem(storageKey, today);
//       } else {
//         localStorage.setItem("user_joined", today);
//       }
//       setJoinDays(0);
//     }
//   };

//   const getPlatformName = () => {
//     if (miniAppHost === "telegram") return "تلگرام";
//     if (miniAppHost === "eitaa") return "ایتا";
//     return "وب";
//   };

//   const PlatformIconSVG = () => {
//     if (miniAppHost === "telegram") {
//       return (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088cc">
//           <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.509l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.05 5.56-5.022c.242-.213-.054-.333-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.536-.196 1.006.128.832.941z"/>
//         </svg>
//       );
//     } else if (miniAppHost === "eitaa") {
//       return (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4444">
//           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-12S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
//         </svg>
//       );
//     }
//     return <Globe size={24} />;
//   };

//   const getInitials = () => {
//     if (miniAppUser) {
//       if (miniAppHost === "telegram") {
//         const first = miniAppUser.first_name?.[0] || "";
//         const last = miniAppUser.last_name?.[0] || "";
//         return (first + last).toUpperCase() || "TG";
//       } else if (miniAppHost === "eitaa") {
//         const first = miniAppUser.first_name?.[0] || "";
//         const last = miniAppUser.last_name?.[0] || "";
//         return (first + last).toUpperCase() || "ET";
//       }
//     }
//     return user.name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleDeleteLocalData = () => {
//     if (
//       window.confirm(
//         "آیا مطمئن هستید که می‌خواهید اطلاعات این دستگاه را پاک کنید؟ این عمل غیرقابل بازگشت است."
//       )
//     ) {
//       const host = detectMiniAppHost();

//       if (host !== "unknown") {
//         const keys = Object.keys(localStorage);
//         keys.forEach((key) => {
//           if (key.startsWith(`${host}_`)) {
//             localStorage.removeItem(key);
//           }
//         });
//       }

//       localStorage.removeItem("user_profile");
//       localStorage.removeItem("user_joined");
//       localStorage.removeItem("quiz_answers");
//       localStorage.removeItem("quiz_results");

//       const defaultUser = {
//         name: "کاربر عزیز",
//         email: "",
//         phone: "",
//         bio: "",
//         username: "",
//         userId: "",
//         platform: "web",
//       };

//       setUser(defaultUser);
//       setUserImage(null);
//       setJoinDays(0);

//       if (isMiniApp && miniAppData) {
//         if (miniAppHost === "telegram" && miniAppData.showPopup) {
//           miniAppData.showPopup({
//             title: "حذف شد",
//             message: "اطلاعات این دستگاه با موفقیت حذف شد",
//             buttons: [{ type: "ok" }],
//           });
//         } else if (miniAppHost === "eitaa" && miniAppData.showAlert) {
//           miniAppData.showAlert("اطلاعات این دستگاه با موفقیت حذف شد");
//         }
//       } else {
//         alert("✅ اطلاعات این دستگاه با موفقیت حذف شد");
//       }
//     }
//   };

//   const handleBackToApp = () => {
//     if (isMiniApp && miniAppData && miniAppData.close) {
//       miniAppData.close();
//     } else {
//       navigate("/");
//     }
//   };

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <div className="profile-header">
//           <h1 className="profile-title">پروفایل</h1>
//           <p className="profile-subtitle">
//             {user.username ? `@${user.username}` : "حساب کاربری شما"}
//           </p>
//         </div>

//         <div className="profile-content">
//           <div className="profile-section">
//             <div className="profile-image-wrapper">
//               <div className="profile-image-container">
//                 <div className="profile-image">
//                   {userImage ? (
//                     <img
//                       src={userImage}
//                       alt={user.name}
//                       className="profile-avatar"
//                       onError={(e) => {
//                         e.target.style.display = "none";
//                         e.target.nextElementSibling.style.display = "flex";
//                       }}
//                     />
//                   ) : null}
//                   <span
//                     className="profile-initials"
//                     style={{ display: userImage ? "none" : "flex" }}
//                   >
//                     {getInitials()}
//                   </span>
//                 </div>
//               </div>

//               <div className="platform-display">
//                 <div className="platform-icon">
//                   <PlatformIconSVG />
//                 </div>
//                 <span className="platform-name">{getPlatformName()}</span>
//               </div>

//               <h2 className="user-name">{user.name}</h2>

//               <div className="verification-badge">
//                 <CheckCircle size={14} />
//                 <span>احراز شده</span>
//               </div>
//             </div>
//           </div>

//           <div className="info-section">
//             <div className="section-header">
//               <h3>اطلاعات</h3>
//               <p>جزئیات حساب کاربری</p>
//             </div>

//             <div className="info-grid">
//               <div className="info-item">
//                 <div className="info-label">
//                   <User size={14} />
//                   نام
//                 </div>
//                 <div className="info-value">{user.name}</div>
//               </div>

//               {user.username && (
//                 <div className="info-item">
//                   <div className="info-label">
//                     <User size={14} />
//                     کاربری
//                   </div>
//                   <div className="info-value">@{user.username}</div>
//                 </div>
//               )}

//               {user.userId && (
//                 <div className="info-item">
//                   <div className="info-label">
//                     <Shield size={14} />
//                     شناسه
//                   </div>
//                   <div className="info-value code">{user.userId}</div>
//                 </div>
//               )}

//               {user.email && (
//                 <div className="info-item">
//                   <div className="info-label">
//                     <Mail size={14} />
//                     ایمیل
//                   </div>
//                   <div className="info-value">{user.email}</div>
//                 </div>
//               )}

//               {user.phone && (
//                 <div className="info-item">
//                   <div className="info-label">
//                     <Phone size={14} />
//                     تلفن
//                   </div>
//                   <div className="info-value">{user.phone}</div>
//                 </div>
//               )}

//               {user.bio && (
//                 <div className="info-item">
//                   <div className="info-label">
//                     <User size={14} />
//                     درباره
//                   </div>
//                   <div className="info-value">{user.bio}</div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="stats-section">
//             <h3 className="stats-title">آمار</h3>

//             <div className="stats-grid">
//               <div className="stat-item">
//                 <div className="stat-icon">
//                   <Calendar size={20} />
//                 </div>
//                 <div className="stat-content">
//                   <div className="stat-number">{joinDays}</div>
//                   <div className="stat-label">روز</div>
//                 </div>
//               </div>

//               <div className="stat-item">
//                 <div className="stat-icon">
//                   {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
//                 </div>
//                 <div className="stat-content">
//                   <div className="stat-number">
//                     {isOnline ? "آن" : "اف"}
//                   </div>
//                   <div className="stat-label">
//                     {isOnline ? "آنلاین" : "آفلاین"}
//                   </div>
//                 </div>
//               </div>

//               <div className="stat-item">
//                 <div className="stat-icon">
//                   <PlatformIconSVG />
//                 </div>
//                 <div className="stat-content">
//                   <div className="stat-number">
//                     {getPlatformName().slice(0, 2)}
//                   </div>
//                   <div className="stat-label">پلتفرم</div>
//                 </div>
//               </div>
//             </div>

//             <div className="connection-status">
//               <div
//                 className={`status-dot ${isOnline ? "online" : "offline"}`}
//               ></div>
//               <span>{isOnline ? "آنلاین" : "آفلاین"}</span>
//             </div>
//           </div>

//           <div className="profile-actions">
//             <button
//               className="action-button danger"
//               onClick={() => setShowConfirmModal(true)}
//             >
//               <Trash2 size={18} />
//               <span>حذف اطلاعات دستگاه</span>
//             </button>

//             <button
//               className="action-button secondary"
//               onClick={handleBackToApp}
//             >
//               {isMiniApp ? <ArrowLeft size={18} /> : <Home size={18} />}
//               <span>{isMiniApp ? "بازگشت" : "خانه"}</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {showConfirmModal && (
//         <div className="confirm-modal">
//           <div className="confirm-modal-content">
//             <h3>حذف اطلاعات</h3>
//             <p>
//               آیا مطمئن هستید که می‌خواهید تمام اطلاعات ذخیره‌شده روی این دستگاه را حذف کنید؟
//             </p>
//             <div className="confirm-modal-buttons">
//               <button
//                 className="confirm-modal-button confirm"
//                 onClick={() => {
//                   handleDeleteLocalData();
//                   setShowConfirmModal(false);
//                 }}
//               >
//                 حذف اطلاعات
//               </button>
//               <button
//                 className="confirm-modal-button cancel"
//                 onClick={() => setShowConfirmModal(false)}
//               >
//                 لغو
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <AdvancedBottomNavigation />
//     </div>
//   );
// };

// export default Profile;