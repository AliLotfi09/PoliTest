import React from 'react';

const QuizScreen = ({
  currentQuestion,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  progress
}) => {
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <>
      <div className="quiz-header">
        <span className="quiz-counter">
          سوال <strong>{currentQuestion + 1}</strong> از {totalQuestions}
        </span>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div id="questionContainer">
        <div className="question-block">
          <div className="question-header">
            <div className="question-text-with-icon">{question}</div>
          </div>
          <div className="options">
            {options.map((option, index) => (
              <div
                key={option.id}
                className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => onSelectAnswer(index)}
              >
                {option.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          className="btn"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
        >
          قبلی
        </button>
        <button className="btn" onClick={onNext}>
          {isLastQuestion ? "مشاهده نتیجه" : "بعدی"}
        </button>
      </div>
    </>
  );
};

export default QuizScreen;