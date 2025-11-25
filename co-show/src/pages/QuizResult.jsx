import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizResult() {
  const { qid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("quiz-result-route", `qz-q${qid}`);
    return () => document.body.classList.remove("quiz-result-route", `qz-q${qid}`);
  }, [qid]);

  const handleNext = () => {
    const current = Number(qid);
    if (current < 3) {
      // 퀴즈 1, 2는 다음 퀴즈로 이동
      navigate(`/quiz/${current + 1}`);
    } else {
      // 퀴즈 3은 이벤트 완료 페이지로 이동
      navigate("/events/complete");
    }
  };

  return (
    <main className="qz-page">
      <div className={`qz-result qz-q${qid}`}>
        <div className="qz-result-text qz-correct" />
        <button
          className="qz-next-btn"
          onClick={handleNext} // 다음 문제로
        />
      </div>
    </main>
  );
}
