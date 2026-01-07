import { useEffect } from "react";

export default function AdlyBanner() {
  useEffect(() => {
    if (window.AdlyWidget) {
      window.AdlyWidget.init({
        apiKey: "71c026a3600d7d159e81a2a6ef790e54",
        containerId: "adly-container",
        barnamk: "strategic_test_app",
        adType: "banner",
        width: 300,
        height: 250,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://myadino.ir/widget/adly-widget.js";
    script.async = true;
    script.onload = () => {
      window.AdlyWidget.init({
        apiKey: "71c026a3600d7d159e81a2a6ef790e54",
        containerId: "adly-container",
        barnamk: "strategic_test_app",
        adType: "banner",
        width: 728,
  height: 90,
  bannerSize: 'medium'
      });
    };

    document.body.appendChild(script);
  }, []);

  return <div id="adly-container" />;
}
