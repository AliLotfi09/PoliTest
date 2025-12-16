import { useState, useEffect } from 'react';
import { questions, leaders, traitNames } from '../data';
import { calculateUserTraits, findBestMatch } from '../utils/calculations';
import { saveTestResults, loadTestResults, clearTestResults } from '../utils/storage';

const useTestState = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [userTraits, setUserTraits] = useState({});
  const [result, setResult] = useState(null);
  const [showToast, setShowToast] = useState(null);

  // Load saved results on mount
  useEffect(() => {
    const savedResults = loadTestResults();
    if (savedResults) {
      setAnswers(savedResults.answers);
      setUserTraits(savedResults.traits);
      setResult(savedResults.result);
      setTestCompleted(true);
    }
  }, []);

  const startTest = () => {
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setUserTraits({});
    setResult(null);
    clearTestResults();
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

    // Calculate traits after each answer
    const traits = calculateUserTraits(newAnswers, questions);
    setUserTraits(traits);
  };

  const nextQuestion = () => {
    if (answers[currentQuestion] === null) {
      setShowToast('لطفاً یک گزینه را انتخاب کنید');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      window.scrollTo(0, 0);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo(0, 0);
    }
  };

  const calculateResult = () => {
    const traits = calculateUserTraits(answers, questions);
    const match = findBestMatch(traits, leaders);
    
    setUserTraits(traits);
    setResult(match);
    setTestCompleted(true);

    // Save to storage
    saveTestResults(match, answers, traits);
  };

  const restartTest = () => {
    startTest();
    setShowToast('آزمون مجدداً شروع شد');
  };

  const shareResult = () => {
    if (!result) return;
    
    const text = `من در تست شخصیت سیاسی "${result.name}" شدم! درصد تطابق: ${result.percentage}%`;
    
    navigator.clipboard.writeText(text)
      .then(() => setShowToast('نتیجه در کلیپ‌بورد کپی شد'))
      .catch(() => setShowToast('خطا در کپی کردن نتیجه'));
  };

  const downloadResult = async (element) => {
    if (!element || !result) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `personality-test-${result.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setShowToast('تصویر با موفقیت دانلود شد');
    } catch (error) {
      console.error('Error downloading image:', error);
      setShowToast('خطا در دانلود تصویر');
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  return {
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
    leaders,
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
  };
};

export default useTestState;