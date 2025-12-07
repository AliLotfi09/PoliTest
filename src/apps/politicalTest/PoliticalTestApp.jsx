import React, { useState, useEffect } from "react";
import "./styles/App.css";
import useTestState from './hooks/useTestState';
import IntroSlides from './components/IntroSlides';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import PredictionGauge from './components/PredictionGauge';
import Toast from './components/Toast';
import { questionExplanations } from './data';
import Changelog from '../../components/Changelog';

function PoliticalTestApp() {
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const [showMainIntro, setShowMainIntro] = useState(false);

  const {
    // State
    currentQuestion,
    answers,
    testStarted,
    testCompleted,
    userTraits,
    result,
    showToast,
    
    // Data
    questions,
    traitNames,
    
    // Actions
    startTest,
    handleAnswer,
    nextQuestion,
    prevQuestion,
    restartTest,
    shareResult,
    downloadResult,
    closeToast
  } = useTestState();

  // بررسی اولین بار ورود کاربر
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      setShowIntroSlides(false);
      setShowMainIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowIntroSlides(false);
    setShowMainIntro(true);
  };

  return (
    <>
      {/* Changelog همیشه در پس‌زمینه قرار دارد */}
      <Changelog />
      
      {/* نمایش Toast اگر وجود داشت */}
      {showToast && (
        <Toast 
          message={showToast} 
          onClose={closeToast}
        />
      )}

      {/* حالت‌های مختلف برنامه */}
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
              onSelectAnswer={(optionIndex) => handleAnswer(currentQuestion, optionIndex)}
              onNext={nextQuestion}
              onPrev={prevQuestion}
              explanation={questionExplanations[currentQuestion]}
            />
          </div>
          
          <div className="sidebar">
            <PredictionGauge answers={answers} />
          </div>
        </div>
      ) : (
        <div className="app-container">
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