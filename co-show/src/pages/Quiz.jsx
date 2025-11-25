import { useNavigate } from "react-router-dom";
import "../styles/Quiz.css";
import { emitButtonClick, emitPageNavigation } from "../api/temiApi";

export default function Quiz(){
  const nav = useNavigate();
  
  const handleQuizStart = () => {
    emitButtonClick("quiz_start_button");
    emitPageNavigation("quiz", "quiz/1");
    nav("/quiz/1");
  };
  
  return (
    <main className="quiz-page">
      <section className="quiz-stage" />
      <button
        className="quiz-cta"
        onClick={handleQuizStart}
        aria-label="퀴즈 도전"
      >
        <img src={"/assets/quiz/Group 97.svg"} alt="퀴즈 도전" />
      </button>
    </main>
  );
}
