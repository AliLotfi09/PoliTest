import { useState, useEffect } from 'react';
import { questions, traitNames } from '../data'; // فقط از index import کن
import { getFilteredLeaders } from '../data/leaders'; // اینو مستقیم از leaders بگیر
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
  
  // دریافت لیست فیلتر شده رهبران
  const [filteredLeaders, setFilteredLeaders] = useState([]);

  // Load leaders and saved results on mount
  useEffect(() => {
    // بارگذاری رهبران فیلتر شده
    const leaders = getFilteredLeaders();
    setFilteredLeaders(leaders);
    
    // برای دیباگ
    console.log('🔍 Filtered leaders loaded:', leaders.length);
    console.log('👑 Available leaders for this platform:', leaders.map(l => l.name));
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('🎯 Platform detection:', window.Telegram ? 'Telegram' : window.Eitaa ? 'Eitaa' : 'Web');
    
    // Check if any Pahlavi leaders are still present (should not be in Eitaa)
    const pahlaviLeaders = leaders.filter(l => 
      l.name.includes('پهلوی') || 
      l.name.includes('رضا شاه') || 
      l.name.includes('محمدرضا')
    );
    if (pahlaviLeaders.length > 0) {
      console.warn('⚠️ Pahlavi leaders still present:', pahlaviLeaders.map(l => l.name));
    }
    
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
    console.log('📊 Calculating result with', filteredLeaders.length, 'filtered leaders');
    
    // دیباگ
    if (filteredLeaders.length === 0) {
      console.error('❌ No filtered leaders available! Reloading...');
      const leaders = getFilteredLeaders();
      setFilteredLeaders(leaders);
    }
    
    const traits = calculateUserTraits(answers, questions);
    const match = findBestMatch(traits, filteredLeaders);
    
    if (!match) {
      console.error('❌ No match found with filtered leaders!');
      return;
    }
    
    console.log('✅ Best match found:', match.name);
    
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
    
    const text = `
    👤 نتیجه تست شخصیت سیاسی

شما شبیه هستید به:
${result.name}
${result.title}

📊 درصد تطابق: ${result.percentage}%
${result.description}

🏆 مهم‌ترین ویژگی‌ها:
${Object.entries(result.traits || {})
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)
  .map(([trait, score]) => `• ${traitNames[trait] || trait}: ${score}/4`)
  .join('\n')}

🎯 تست شخصیت سیاسی
Politest.ir
      `.trim();
    
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
    leaders: filteredLeaders, // این مهم است - filteredLeaders را پاس بده
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