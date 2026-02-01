import { useEffect } from "react";
import { detectMiniAppHost } from '@/utils/miniAppDetector';

export default function AdlyBanner() {
  const host = detectMiniAppHost();

  useEffect(() => {
    if (typeof window !== "undefined" && window.AdlyWidget && host !== "telegram") {
      window.AdlyWidget.init({
        apiKey: "71c026a3600d7d159e81a2a6ef790e54",
        containerId: "adly-container",
        barnamk: "strategic_test_app",
        adType: "banner",
        width: 300,
        height: 250,
      });
    }
  }, [host]);

  if (host === "telegram") {
    return null;
  }

  return (
    <div id="adly-container" style={{ textAlign: 'center', margin: '10px 0' }}></div>
  );
}