// data/changelogData.js
export const changelogData = {
  version: "1.2.3",
  releaseDate: "1404/09/25", 
  forceUpdate: false,
  minVersion: "1.2.0",
  downloadUrl: "https://github.com/Alilotfi09/PoliTest/releases/latest",
  apiCheckUrl: "", 
  
  changes: [
    { type: "new", text: "اضافه شدن ۲۰ رهبر جدید" },
    { type: "improved", text: "بهبود دقت الگوریتم تطبیق" },
    { type: "improved", text: "افزایش سرعت لودینگ" },
    { type: "fixed", text: "رفع باگ نمایش نتایج" }
  ],
  
  versionHistory: [
    {
      version: "1.2.2",
      date: "1404/09/25",
      changes: ["افزودن ۱۰ سوال جدید", "بهبود رابط کاربری"]
    },
    {
      version: "1.2.1", 
      date: "1404/09/20",
      changes: ["رفع باگ‌های جزئی"]
    }
  ]
};

export const useChangelog = () => {
  const APP_VERSION = changelogData.version;
  
  const hasSeenCurrentVersion = () => {
    const lastSeen = localStorage.getItem('lastSeenChangelog');
    return lastSeen === APP_VERSION;
  };

  const markAsSeen = () => {
    localStorage.setItem('lastSeenChangelog', APP_VERSION);
  };

  // تابع ساده بدون چک کردن آنلاین
  const checkForUpdate = () => {
    return Promise.resolve({
      hasUpdate: false,
      latestVersion: APP_VERSION,
      data: changelogData,
      source: 'local'
    });
  };

  return {
    data: changelogData,
    currentVersion: APP_VERSION,
    hasSeenCurrentVersion,
    markAsSeen,
    checkForUpdate
  };
};