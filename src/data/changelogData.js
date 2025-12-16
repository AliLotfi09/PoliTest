// data/changelogData.js
export const changelogData = {
  version: "1.2.2",
  build: "2024112501", // شماره بیلد برای مقایسه بهتر
  releaseDate: "1404/09/25",
  forceUpdate: false, // اگر true باشد، کاربر مجبور به آپدیت است
  minVersion: "1.2.0", // حداقل نسخه مورد نیاز برای کارکرد برنامه
  downloadUrl: "https://github.com/Politest/releases/latest",
  apiCheckUrl: "https://raw.githubusercontent.com//Politest/main/public/version.json",
  
  changes: [
    { type: "new", text: "افزودن 10 سوال جدید برای دقیق تر شدن نتیجه" },
    { type: "new", text: "افزودن صفحه قوانین و مقررات" },
    { type: "new", text: "افزودن ده ها رهبر جدید به نتایج" },
    { type: "improved", text: "بهبود نمایش در مینی اپ ها" },
    { type: "improved", text: "بهبود رابط کاربری" },
  ],

  // تاریخچه نسخه‌ها
  versionHistory: [
    {
      version: "1.2.1",
      date: "1404/09/20",
      changes: [
        "رفع باگ نمایش نتایج",
        "بهبود عملکرد لودینگ"
      ]
    },
    {
      version: "1.2.0",
      date: "1404/09/15",
      changes: [
        "اضافه شدن رهبران جدید",
        "بهبود سیستم امتیازدهی"
      ]
    },
    {
      version: "1.1.0",
      date: "1404/08/30",
      changes: [
        "افزودن حالت تاریک",
        "اضافه شدن ارتعاش",
        "بهبود دقت تست"
      ]
    }
  ]
};

// توابع کمکی
export const useChangelog = () => {
  const APP_VERSION = "1.2.2"; // باید با version بالا یکسان باشد
  
  const hasSeenCurrentVersion = () => {
    const lastSeenVersion = localStorage.getItem('lastSeenChangelogVersion');
    return lastSeenVersion === changelogData.version;
  };

  const markAsSeen = () => {
    localStorage.setItem('lastSeenChangelogVersion', changelogData.version);
  };

  const checkForUpdate = async () => {
    try {
      // شبیه‌سازی بررسی از گیت‌هاب
      const response = await fetch(changelogData.apiCheckUrl, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('خطا در بررسی آپدیت');
      
      const latestData = await response.json();
      return {
        hasUpdate: compareVersions(APP_VERSION, latestData.version) < 0,
        latestVersion: latestData.version,
        forceUpdate: latestData.forceUpdate || false,
        data: latestData
      };
    } catch (error) {
      console.error('Error checking update:', error);
      // حالت fallback - بررسی بر اساس داده محلی
      return {
        hasUpdate: false,
        latestVersion: APP_VERSION,
        forceUpdate: false,
        data: changelogData,
        error: true
      };
    }
  };

  const compareVersions = (v1, v2) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;
      if (num1 !== num2) {
        return num1 - num2;
      }
    }
    return 0;
  };

  const shouldForceUpdate = () => {
    return compareVersions(APP_VERSION, changelogData.minVersion) < 0;
  };

  return {
    data: changelogData,
    currentVersion: APP_VERSION,
    hasSeenCurrentVersion,
    markAsSeen,
    checkForUpdate,
    shouldForceUpdate,
    compareVersions
  };
};