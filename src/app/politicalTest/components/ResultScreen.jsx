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
    if (!shareableRef.current || !result || isDownloading) return;

    setIsDownloading(true);

    try {
      if (isMiniApp) {
        handleCopyResult();
        return;
      }

      const element = shareableRef.current.cloneNode(true);
      element.style.width = "600px";
      element.style.padding = "40px";
      element.style.backgroundColor = "#ffffff";
      element.style.borderRadius = "24px";

      element.classList.add("download-version");

      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 600px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 24px;
      `;

      const content = document.createElement("div");
      content.className = "preview-content";
      content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 32px 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
      `;

      const header = document.createElement("div");
      header.className = "download-header";
      header.innerHTML = `
        <div class="download-title" style="font-size: 14px; color: #999; margin-bottom: 16px; font-weight: 500;">نتایج تست شخصیت سیاسی</div>
        <div class="result-name" style="font-size: 32px; font-weight: 700; margin: 8px 0; color: #1a1a1a;">${result.name}</div>
        <div class="result-title" style="font-size: 14px; color: #666; margin-bottom: 24px;">${result.title}</div>
      `;

      const matchSection = document.createElement("div");
      matchSection.className = "preview-match";
      matchSection.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        margin: 24px 0;
      `;
      matchSection.innerHTML = `
        <div class="preview-match-score" style="font-size: 48px; font-weight: 700; margin-bottom: 4px;">${result.percentage}%</div>
        <div class="preview-match-label" style="font-size: 13px; opacity: 0.9;">درصد تطابق</div>
      `;

      const description = document.createElement("div");
      description.className = "preview-description";
      description.style.cssText = `
        font-size: 15px;
        line-height: 1.8;
        color: #444;
        background: #f8f8f8;
        border-radius: 12px;
        padding: 16px;
        margin: 24px 0;
        text-align: right;
      `;
      description.textContent = result.description;

      const topTraits = Object.entries(result.traits || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

      const traitsGrid = document.createElement("div");
      traitsGrid.className = "preview-traits";
      traitsGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin: 24px 0;
      `;

      traitsGrid.innerHTML = topTraits
        .map(
          ([trait, score]) => `
        <div class="preview-trait-item" style="background: #f8f8f8; border-radius: 12px; padding: 12px; text-align: center;">
          <div class="preview-trait-name" style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600;">${
            traitNames[trait] || trait
          }</div>
          <div class="preview-trait-bar" style="height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; margin-bottom: 6px;">
            <div class="preview-trait-fill" style="height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); border-radius: 2px; width: ${
              (score / 4) * 100
            }%"></div>
          </div>
          <div class="preview-trait-score" style="font-size: 11px; font-weight: 700; color: #333;">${score}/4</div>
        </div>
      `
        )
        .join("");

      const footer = document.createElement("div");
      footer.className = "preview-footer";
      footer.style.cssText = `
        text-align: center;
        padding-top: 20px;
        border-top: 2px solid #f0f0f0;
        margin-top: 24px;
      `;
      footer.innerHTML = `
        <div class="preview-footer-text" style="font-size: 13px; color: #999; font-weight: 500;">نتیجه تست شخصیت سیاسی</div>
        <div class="preview-footer-url" style="font-size: 12px; color: #667eea; font-weight: 600; margin-top: 4px;">Politest.ir</div>
      `;

      content.appendChild(header);
      content.appendChild(matchSection);
      content.appendChild(description);
      content.appendChild(traitsGrid);
      content.appendChild(footer);
      container.appendChild(content);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `personality-test-${result.name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(container);

      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error("Error:", error);

      if (isMiniApp) {
        handleCopyResult();
      } else if (window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
          title: "خطا",
          message: "خطا در دانلود تصویر",
          buttons: [{ type: "ok" }],
        });
      } else {
        alert("خطا در دانلود تصویر");
      }
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
