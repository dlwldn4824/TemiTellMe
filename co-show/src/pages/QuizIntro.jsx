import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quizIntro.css";

export default function QuizIntro() {
  const navigate = useNavigate();

  const goToQuiz = () => navigate("/quiz");        // 퀴즈 첫 문제로
  const goToTypeTest = () => navigate("/type-test");  // 유형 테스트 시작으로

  return (
    <main className="quiz-intro">
      <h1 className="quiz-title"></h1>

      <div className="quiz-btn-wrap">
        <button
          className="intro-btn quiz"
          onClick={goToQuiz}
          aria-label="퀴즈 풀기"
        >
        </button>

        <button
          className="intro-btn type"
          onClick={goToTypeTest}
          aria-label="유형 테스트"
        >
        </button>
      </div>
    </main>
  );
}
