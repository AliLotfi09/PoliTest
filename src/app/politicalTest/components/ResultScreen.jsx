import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import html2canvas from "html2canvas";
import { Share2, Download, RotateCcw, Heart, Copy, Share } from "lucide-react";
import { getFilteredLeaders } from "../data/leaders";
import ShinyText from "@/components/ShinyText";

Chart.register(...registerables);

const ResultScreen = ({
  result,
  userTraits,
  traitNames,
  onRestart,
  onShare,
  onDownload,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const shareableRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const checkMiniApp = () => {
      const ua = navigator.userAgent.toLowerCase();
      setIsMiniApp(ua.includes("telegram") || ua.includes("eitaa"));
    };

    checkMiniApp();
  }, []);

  useEffect(() => {
    if (chartRef.current && result) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const topTraits = Object.entries(userTraits)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const labels = topTraits.map(([trait]) => traitNames[trait] || trait);
      const userData = topTraits.map(([, value]) => value);
      const leaderData = topTraits.map(([trait]) => result.traits[trait] || 0);

      const allValues = [...userData, ...leaderData];
      const maxValue = Math.max(...allValues);
      const chartMax = maxValue + maxValue * 0.3;

      chartInstance.current = new Chart(chartRef.current, {
        type: "radar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "شخصیت شما",
              data: userData,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderColor: "rgba(59, 130, 246, 0.8)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: result.name,
              data: leaderData,
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              borderColor: "rgba(139, 92, 246, 0.8)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(139, 92, 246, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderDash: [5, 5],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              beginAtZero: true,
              max: chartMax,
              ticks: {
                stepSize: Math.ceil(chartMax / 5),
                backdropColor: "transparent",
                font: {
                  size: 10,
                },
              },
              pointLabels: {
                font: {
                  size: 12,
                  weight: "500",
                },
                color: "#333",
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
              angleLines: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 12,
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              titleFont: {
                size: 13,
              },
              bodyFont: {
                size: 12,
              },
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
              rtl: true,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}/4`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [result, userTraits, traitNames]);

  const [showToast, setShowToast] = useState(null);

  const handleCopyResult = async () => {
    if (!result || isCopying) return;

    setIsCopying(true);

    try {
      const shareText = `
👤 نتیجه تست شخصیت سیاسی

شما شبیه هستید به:
${result.name}
${result.title}

📊 درصد تطابق: ${result.percentage}%
${result.description}

🏆 مهم‌ترین ویژگی‌ها:
${Object.entries(result.traits || {})
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([trait, score]) => `• ${traitNames[trait] || trait}: ${score}/4`)
  .join("\n")}

🎯 تست شخصیت سیاسی
Politest.ir
      `.trim();

      await navigator.clipboard.writeText(shareText);

      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "کپی شد",
          message: "نتیجه در کلیپ‌بورد کپی شد",
          buttons: [{ type: "ok" }],
        });
      } else if (window.Eitaa?.WebApp?.showAlert) {
        window.Eitaa.WebApp.showAlert("نتیجه در کلیپ‌بورد کپی شد");
      } else {
        setShowToast("نتیجه در کلیپ بورد کپی شد");
      }

      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error("Error copying:", error);

      if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "خطا",
          message: "خطا در کپی کردن نتیجه",
          buttons: [{ type: "ok" }],
        });
      } else {
        alert("خطا در کپی کردن نتیجه");
      }
    } finally {
      setIsCopying(false);
    }
  };

  const handleShareResult = () => {
    const shareText = `نتیجه تست شخصیت سیاسی من: ${result.name} - ${result.percentage}% تطابق`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: "نتیجه تست شخصیت سیاسی",
          text: shareText,
          url: shareUrl,
        })
        .catch(console.error);
    } else if (window.Telegram?.WebApp?.shareToChat) {
      window.Telegram.WebApp.shareToChat({
        title: "نتیجه تست شخصیت سیاسی",
        text: shareText,
        url: shareUrl,
      });
    } else if (window.Eitaa?.WebApp?.share) {
      window.Eitaa.WebApp.share({
        title: "نتیجه تست شخصیت سیاسی",
        message: `${shareText}\n${shareUrl}`,
      });
    } else {
      handleCopyResult();
    }
  };
  const handleDownload = async () => {
    if (!result || isDownloading) return;

    setIsDownloading(true);

    try {
      if (isMiniApp) {
        handleCopyResult();
        return;
      }

      /* ---------- container ---------- */
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "600px",
        padding: "32px",
        direction: "rtl",
        fontFamily: "'Estedad', 'Vazirmatn', sans-serif",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        borderRadius: "24px",
      });

      /* ---------- content ---------- */
      const content = document.createElement("div");
      Object.assign(content.style, {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px",
        textAlign: "center",
        unicodeBidi: "plaintext",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)",
      });

      /* ---------- header ---------- */
      const header = document.createElement("div");

      const subtitle = document.createElement("div");
      subtitle.textContent = "نتایج تست شخصیت سیاسی";
      Object.assign(subtitle.style, {
        fontSize: "13px",
        color: "#999",
        marginBottom: "12px",
        fontWeight: "500",
      });

      const name = document.createElement("div");
      name.textContent = result.name;
      Object.assign(name.style, {
        fontSize: "30px",
        fontWeight: "800",
        color: "#111",
        marginBottom: "6px",
      });

      const title = document.createElement("div");
      title.textContent = result.title;
      Object.assign(title.style, {
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
      });

      header.append(subtitle, name, title);

      /* ---------- match ---------- */
      const match = document.createElement("div");
      Object.assign(match.style, {
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
        borderRadius: "16px",
        padding: "18px",
        margin: "20px 0",
      });

      const percent = document.createElement("div");
      percent.textContent = `${result.percentage}%`;
      Object.assign(percent.style, {
        fontSize: "44px",
        fontWeight: "800",
      });

      const percentLabel = document.createElement("div");
      percentLabel.textContent = "درصد تطابق";
      Object.assign(percentLabel.style, {
        fontSize: "12px",
        opacity: "0.9",
      });

      match.append(percent, percentLabel);

      /* ---------- description ---------- */
      const desc = document.createElement("div");
      desc.textContent = result.description;
      Object.assign(desc.style, {
        background: "#f8f8f8",
        borderRadius: "12px",
        padding: "16px",
        margin: "20px 0",
        fontSize: "14px",
        lineHeight: "1.9",
        color: "#444",
        textAlign: "right",
      });

      /* ---------- traits ---------- */
      const traits = document.createElement("div");
      Object.assign(traits.style, {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        margin: "20px 0",
      });

      Object.entries(result.traits || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .forEach(([key, value]) => {
          const item = document.createElement("div");
          Object.assign(item.style, {
            background: "#f8f8f8",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          });

          const label = document.createElement("div");
          label.textContent = traitNames[key] || key;
          Object.assign(label.style, {
            fontSize: "12px",
            color: "#666",
            fontWeight: "600",
            marginBottom: "8px",
          });

          const bar = document.createElement("div");
          Object.assign(bar.style, {
            height: "4px",
            background: "#e0e0e0",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "6px",
          });

          const fill = document.createElement("div");
          Object.assign(fill.style, {
            height: "100%",
            width: `${(value / 4) * 100}%`,
            background: "linear-gradient(90deg, #667eea, #764ba2)",
          });

          bar.appendChild(fill);

          const score = document.createElement("div");
          score.textContent = `${value}/4`;
          Object.assign(score.style, {
            fontSize: "11px",
            fontWeight: "700",
            color: "#333",
          });

          item.append(label, bar, score);
          traits.appendChild(item);
        });

      /* ---------- footer ---------- */
      const footer = document.createElement("div");
      Object.assign(footer.style, {
        borderTop: "2px solid #f0f0f0",
        marginTop: "20px",
        paddingTop: "16px",
        fontSize: "12px",
        color: "#999",
      });
      footer.textContent = "Politest.ir";

      /* ---------- assemble ---------- */
      content.append(header, match, desc, traits, footer);
      container.appendChild(content);
      document.body.appendChild(container);

      /* ---------- wait for render ---------- */
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(r));

      /* ---------- capture ---------- */
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `politest-${result.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(container);
      onDownload?.();
    } catch (error) {
      console.error(error);
      alert("خطا در ساخت تصویر");
    } finally {
      setIsDownloading(false);
    }
  };

  const topTraits = Object.entries(result.traits || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="result-screen active">
      <div className="result-wrapper">
        <div ref={shareableRef} id="shareableContent">
          <div className="result-header">
            <img
              className="result-image"
              src={result.image}
              alt={result.name}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/140x140?text=Leader";
              }}
            />
            <div className="result-name">
              <ShinyText
                text={result.name}
                speed={2}
                delay={0}
                color="var(--shiny-text-color)"
                shineColor="var(--shiny-shine-color)"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
              />
            </div>
            <div className="result-title">
              <ShinyText
                text={result.title}
                speed={2}
                delay={0}
                color="var(--shiny-text-color)"
                shineColor="var(--shiny-shine-color)"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
              />
            </div>
          </div>

          <div className="match-container">
            <div className="match-score">{result.percentage}%</div>
            <div className="match-label">درصد تطابق</div>
          </div>
          <div className="result-description">{result.description}</div>

          <div className="traits-grid">
            {topTraits.map(([trait, score]) => (
              <div key={trait} className="trait-item">
                <div className="trait-name">{traitNames[trait] || trait}</div>
                <div className="trait-bar">
                  <div
                    className="trait-fill"
                    style={{ width: `${(score / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="trait-score">{score}/4</div>
              </div>
            ))}
          </div>

          <div className="result-detail">
            <div className="detail-label">سبک رهبری</div>
            <div className="detail-value">{result.governingStyle}</div>
          </div>
        </div>

        <div className="personality-chart-container">
          <h3 className="chart-title">نمودار مقایسه شخصیتی</h3>
          <div className="chart-wrapper">
            <canvas ref={chartRef} id="personalityChart"></canvas>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={handleCopyResult}
            disabled={isCopying}
          >
            <Copy size={18} />
            <span>{isCopying ? "در حال کپی..." : "اشتراک گذاری نتیجه"}</span>
          </button>

          <button
            className="action-btn"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download size={18} />
            <span>{isDownloading ? "در حال دانلود..." : "دانلود تصویر"}</span>
          </button>

          <button className="action-btn secondary" onClick={onRestart}>
            <RotateCcw size={18} />
            <span>آزمون دوباره</span>
          </button>

          <a
            href="https://eitaa.com/im_lotfi"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn secondary"
          >
            <Heart size={18} />
            <span>حمایت</span>
          </a>

          {/* Toast داخلی */}
          {showToast && <div className="toast">{showToast}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
