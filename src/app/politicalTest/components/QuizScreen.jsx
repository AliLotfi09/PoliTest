import React, { useState } from "react";
import "../styles/App.css";
import ShinyText from "@/components/ShinyText";

const QuizScreen = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrev,
  explanation,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="quiz-wrapper active">
      <div className="quiz-header">
        <span className="quiz-counter">
          سوال <strong>{questionIndex + 1}</strong> از {totalQuestions}
        </span>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="question-block">
        <div className="question-header">
          <div className="question-text-with-icon">
            <ShinyText
              className="question-text-with-icon"
              text={question.question}
              speed={3}
              delay={2}
              color="var(--shiny-text-color)"
              shineColor="var(--shiny-shine-color)"
              spread={120}
              direction="right"
              yoyo={true}
              pauseOnHover={true}
            />
          </div>
          <button
            className="question-info-btn"
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="توضیحات سوال"
          >
            ?
          </button>
        </div>

        {showTooltip && explanation && (
          <div className="question-tooltip active">
            <div className="tooltip-title">{explanation.title}</div>
            <div className="tooltip-text">{explanation.text}</div>
          </div>
        )}

        <div className="options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option ${selectedAnswer === index ? "selected" : ""}`}
              onClick={() => onSelectAnswer(index)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>

      <div className="controls">
        <button className="btn" onClick={onPrev} disabled={questionIndex === 0}>
          قبلی
        </button>
        <button className="btn" onClick={onNext}>
          {questionIndex === totalQuestions - 1 ? "مشاهده نتایج" : "بعدی"}
        </button>
      </div>
    </div>
  );
};

export default QuizScreen;
