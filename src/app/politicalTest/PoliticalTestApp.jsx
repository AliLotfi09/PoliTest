import React, { useState, useEffect } from "react";
import "./styles/App.css";
import useTestState from "./hooks/useTestState";
import IntroSlides from "./components/IntroSlides";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import PredictionGauge from "./components/PredictionGauge";
import Toast from "./components/Toast";
import { questionExplanations } from "./data";
import Changelog from "../../components/Changelog";
import { Helmet } from "react-helmet-async";
import LeaderBackground from "./components/LeaderBackground";
import Noise from "./components/Noise";

function PoliticalTestApp({ onIntroComplete }) {
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [showMainIntro, setShowMainIntro] = useState(false);

  const {
    currentQuestion,
    answers,
    testStarted,
    testCompleted,
    userTraits,
    result,
    showToast,
    questions,
    traitNames,
    leaders, // این حالا باید filteredLeaders باشد
    startTest,
    handleAnswer,
    nextQuestion,
    prevQuestion,
    restartTest,
    shareResult,
    downloadResult,
    closeToast,
  } = useTestState();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (hasSeenIntro === "true") {
      setShowIntroSlides(false);
      setShowMainIntro(true);
      if (onIntroComplete) onIntroComplete();
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem("hasSeenIntro", "true");
    setShowIntroSlides(false);
    setShowMainIntro(true);
    if (onIntroComplete) onIntroComplete();
  };

  return (
    <>
      <Helmet>
        <title>تست شخصیت سیاسی آنلاین | رایگان</title>
        <meta
          name="description"
          content="تست شخصیت سیاسی آنلاین برای شناسایی گرایش فکری شما بر اساس پاسخ به سوالات تحلیلی."
        />
        <link rel="canonical" href="https://politest.ir" />
      </Helmet>
      
      <Changelog />

      {showToast && <Toast message={showToast} onClose={closeToast} />}




      <div className="leaders">
        <LeaderBackground />
      </div>

      {showIntroSlides ? (
        <IntroSlides onComplete={handleIntroComplete} />
      ) : !testStarted && !result && showMainIntro ? (
        <div className="app-container">
          <IntroScreen onStart={startTest} />
        </div>
      ) : testStarted && !testCompleted ? (
        <div className="app-container">
          <div className="main-content">
            <QuizScreen
              question={questions[currentQuestion]}
              questionIndex={currentQuestion}
              totalQuestions={questions.length}
              selectedAnswer={answers[currentQuestion]}
              onSelectAnswer={(optionIndex) =>
                handleAnswer(currentQuestion, optionIndex)
              }
              onNext={nextQuestion}
              onPrev={prevQuestion}
              explanation={questionExplanations[currentQuestion]}
            />
          </div>

          <div className="sidebar">
            <PredictionGauge answers={answers} leaders={leaders} />
          </div>
        </div>
      ) : (
        <div className="app-container">
          <Helmet>
            <title>نتیجه تست شخصیت سیاسی | تحلیل گرایش فکری شما</title>
            <meta
              name="description"
              content="نتیجه تست شخصیت سیاسی شما آماده است. تحلیل گرایش فکری و ویژگی‌های شخصیتی شما."
            />
          </Helmet>
          <ResultScreen
            result={result}
            userTraits={userTraits}
            traitNames={traitNames}
            onRestart={restartTest}
            onShare={shareResult}
            onDownload={downloadResult}
          />
        </div>
      )}
    </>
  );
}

export default PoliticalTestApp;