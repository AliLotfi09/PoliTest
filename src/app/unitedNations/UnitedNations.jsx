import React, { useState, useMemo, useCallback } from 'react';
import { questions, typeMeta } from './data/questions';
import IntroScreen from './components/IntroScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import Toast from './components/Toast';
import PredictionGauge from './components/PredictionGauge';
import './styles/App.css';

const UnitedNations = () => {
  const [screen, setScreen] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [toast, setToast] = useState({ show: false, message: '' });

  const counts = useMemo(() => {
    const counts = { diplomatic: 0, charismatic: 0, strategic: 0, authoritarian: 0, logical: 0 };
    
    answers.forEach((answer, index) => {
      if (answer !== null && questions[index]) {
        const option = questions[index].options[answer];
        if (option && option.type) {
          counts[option.type] = (counts[option.type] || 0) + 1;
        }
      }
    });

    return counts;
  }, [answers]);

  const totalAnswered = useMemo(() => 
    Object.values(counts).reduce((a, b) => a + b, 0), 
    [counts]
  );

  const percentages = useMemo(() => {
    const percentages = {};
    const answeredCount = answers.filter(a => a !== null).length;
    
    if (answeredCount === 0) {
      Object.keys(counts).forEach(key => {
        percentages[key] = 0;
      });
      return percentages;
    }
    
    let rawPercentages = {};
    let sum = 0;
    
    Object.keys(counts).forEach(key => {
      const rawPercent = (counts[key] / answeredCount) * 100;
      rawPercentages[key] = rawPercent;
      sum += Math.round(rawPercent);
    });
    
    const sortedKeys = Object.keys(rawPercentages).sort((a, b) => {
      const decimalA = rawPercentages[a] - Math.floor(rawPercentages[a]);
      const decimalB = rawPercentages[b] - Math.floor(rawPercentages[b]);
      return decimalB - decimalA;
    });
    
    Object.keys(rawPercentages).forEach(key => {
      percentages[key] = Math.round(rawPercentages[key]);
    });
    
    let currentSum = Object.values(percentages).reduce((a, b) => a + b, 0);
    let diff = 100 - currentSum;
    
    for (let i = 0; i < Math.abs(diff) && i < sortedKeys.length; i++) {
      if (diff > 0) {
        percentages[sortedKeys[i]]++;
      } else if (diff < 0 && percentages[sortedKeys[sortedKeys.length - 1 - i]] > 0) {
        percentages[sortedKeys[sortedKeys.length - 1 - i]]--;
      }
    }
    
    return percentages;
  }, [counts, answers]);

  const primaryType = useMemo(() => {
    const sorted = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    return sorted[0] || 'strategic';
  }, [counts]);

  const progress = useMemo(() => 
    Math.round((currentQuestion / questions.length) * 100), 
    [currentQuestion]
  );

  const showToast = useCallback((message, duration = 2200) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), duration);
  }, []);

  const handleStartTest = useCallback(() => {
    setScreen('quiz');
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
  }, []);

  const handleSelectAnswer = useCallback((answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  }, [currentQuestion, answers]);

  const handleNextQuestion = useCallback(() => {
    if (answers[currentQuestion] === null) {
      showToast("لطفاً یک گزینه انتخاب کنید.");
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (totalAnswered === 0) {
        showToast("ابتدا حداقل یک سوال را پاسخ دهید.");
        return;
      }
      setScreen('result');
    }
  }, [currentQuestion, answers, totalAnswered, showToast]);

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleDownloadImage = async () => {
    const preview = document.getElementById("shareableContent");
    if (!preview) {
      showToast("محتوا برای دانلود پیدا نشد.");
      return;
    }

    showToast("در حال ساخت تصویر...");
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(preview, { scale: 2, useCORS: true, allowTaint: true });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `un-result.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast("تصویر دانلود شد.");
    } catch (err) {
      console.error(err);
      showToast("خطا در ساخت تصویر.");
    }
  };

  const handleShareResult = useCallback(() => {
    const leaderInfo = typeMeta[primaryType] || typeMeta.strategic;
    const matchPercent = Math.max(percentages[primaryType] || 0, 5);
    const text = `${leaderInfo.name} - ${leaderInfo.title}\n${leaderInfo.desc}\nدرصد تطابق: ${matchPercent}%`;
    
    navigator.clipboard?.writeText(text).then(() => {
      showToast("نتیجه کپی شد.");
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast("نتیجه کپی شد.");
    });
  }, [primaryType, percentages, showToast]);

  const handleRestartTest = () => {
    setScreen('quiz');
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    showToast("آزمون مجدداً شروع شد.");
  };

  const predictionData = useMemo(() => {
    if (totalAnswered === 0) return {};
    
    const tempCounts = { diplomatic: 0, charismatic: 0, strategic: 0, authoritarian: 0, logical: 0 };
    
    answers.forEach((ans, i) => {
      if (ans === null) return;
      const opt = questions[i].options[ans];
      if (opt && opt.type) tempCounts[opt.type] = (tempCounts[opt.type] || 0) + 1;
    });

    const predictionPercentages = {};
    Object.keys(tempCounts).forEach(key => {
      predictionPercentages[key] = Math.round((tempCounts[key] / totalAnswered) * 100);
    });

    return predictionPercentages;
  }, [answers, totalAnswered]);

  const currentQuestionData = questions[currentQuestion] || questions[0] || {};

  return (
    <div className="container">
      <Toast 
        message={toast.message} 
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />

      {screen === 'intro' && (
        <IntroScreen onStartTest={handleStartTest} />
      )}

      {screen === 'quiz' && (
        <div id="quizScreen" className="quiz-wrapper active">
          <QuizScreen
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            question={currentQuestionData.question}
            options={currentQuestionData.options || []}
            selectedAnswer={answers[currentQuestion]}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            progress={progress}
          />
          
          <PredictionGauge data={predictionData} />
        </div>
      )}

      {screen === 'result' && (
        <ResultScreen
          primaryType={primaryType}
          percentages={percentages}
          matchPercentage={Math.max(percentages[primaryType] || 0, 5)}
          onDownloadImage={handleDownloadImage}
          onShareResult={handleShareResult}
          onRestartTest={handleRestartTest}
        />
      )}

      <div className="svg-wrapper">
        <img src="assets/countries.svg" alt="countries vector" className="countries" />
      </div>
    </div>
  );
};

export default UnitedNations;