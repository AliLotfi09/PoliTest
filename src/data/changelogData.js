// data/changelogData.js
export const changelogData = {
  version: "1.2.1",
  releaseDate: "1404/09/16",
  changes: [
    { type: "new", text: "سیستم نمایش تغییرات جدید اضافه شد" },
    { type: "improved", text: "بهبود عملکرد کلی برنامه" },
    { type: "fixed", text: "رفع باگ نمایش در موبایل" },
  ]
};

export const useChangelog = () => {
  const hasSeenCurrentVersion = () => {
    const lastSeenVersion = localStorage.getItem('lastSeenChangelogVersion');
    return lastSeenVersion === changelogData.version;
  };

  const markAsSeen = () => {
    localStorage.setItem('lastSeenChangelogVersion', changelogData.version);
  };

  return {
    data: changelogData,
    hasSeenCurrentVersion,
    markAsSeen
  };
};