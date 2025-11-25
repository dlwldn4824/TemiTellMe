import { useMemo, useState } from "react";
import "../styles/events.css";
import { useNavigate } from "react-router-dom";
import {
  emitQuizSelect,
  emitQuizConfirm,
  emitQuizRetry,
  emitQuizNext,
  emitQuizFinish,
  emitButtonClick,
} from "../api/temiApi";


/** 데모 문제 셋: type 'OX' | 'MCQ' */
const QUESTIONS = [
  {
    id: "q1",
    type: "OX",
    question: "나(로봇)은 춤을 추는 기능을 가지고 있다!",
    correct: "O",
    explain:
      "맞아요! 실제로 나(테미텔미)는 간단한 모션 시퀀스로 춤을 출 수 있어요.",
  },
  {
    id: "q2",
    type: "MCQ",
    question: "내 이름은 무엇일까요?",
    choices: ["티미와 수호천사", "테미텔미", "아름다운 테미", "티미와 지우"],
    correctIndex: 2,
    explain:
      "정답은 ‘테미’! 모두가 저를 쉽게 부르고 사용해 줬으면 좋겠어서 테미텔미라는 이름을 갖게 되었어요! 😄",
  },
];
export default function Events() {
  const [idx, setIdx] = useState(0);                 // 현재 문제 인덱스
  const [selected, setSelected] = useState(null);    // 선택 값
  const [step, setStep] = useState("question");      // 'question' | 'result'
  const nav = useNavigate();

  const q = QUESTIONS[idx];
  const isLast = idx === QUESTIONS.length - 1;

  /** OX 정답 여부 계산 */
  const isCorrect = useMemo(() => {
    if (q.type === "OX") return selected === q.correct;
    if (q.type === "MCQ" && typeof selected === "number")
      return selected === q.correctIndex;
    return false;
  }, [q, selected]);

  function pick(choice) {
    setSelected(choice);
    // API를 통한 이벤트 호출
    emitQuizSelect(q.id, choice);
  }

  function confirm() {
    if (selected === null) return alert("선택지를 고르세요!");
    
    // API를 통한 이벤트 호출
    emitQuizConfirm(q.id, selected, isCorrect);
    
    setStep("result");
  }

  function retry() {
    setSelected(null);
    setStep("question");
    
    // API를 통한 이벤트 호출
    emitQuizRetry(q.id);
  }

  function next() {
    if (!isLast) {
      const nextIdx = idx + 1;
      const nextQuestionId = QUESTIONS[nextIdx]?.id;
      
      // API를 통한 이벤트 호출
      emitQuizNext(q.id, nextQuestionId);
      
      setIdx(nextIdx);
      setSelected(null);
      setStep("question");
    }
  }

  function finish() {
    // API를 통한 이벤트 호출
    const correctCount = QUESTIONS.filter((question, i) => {
      if (i === idx) return isCorrect;
      // 이전 문제들의 정답 여부는 추적하지 않음 (간단한 구현)
      return false;
    }).length;
    
    emitQuizFinish(QUESTIONS.length, correctCount);
    emitButtonClick("quiz_finish", { totalQuestions: QUESTIONS.length });
    
    nav("/events/complete");
  }

  return (
    <main className="quiz-wrap">
      {/* 상단 진행도 */}
      <Progress total={QUESTIONS.length} current={idx} />

      {/* 칠판 + 내용 */}
      <section className="board">
        <Ribbon>문제</Ribbon>

        {step === "question" && (
          <>
            <h2 className="board-title">{q.question}</h2>

            {q.type === "OX" ? (
              <div className="choices">
                {["O", "X"].map((ch) => (
                  <ChoiceCircle
                    key={ch}
                    label={ch}
                    selected={selected === ch}
                    onClick={() => pick(ch)}
                  />
                ))}
              </div>
            ) : (
              <div className="tiles">
                {q.choices.map((label, i) => (
                  <Tile
                    key={label}
                    label={label}
                    selected={selected === i}
                    onClick={() => pick(i)}
                  />
                ))}
              </div>
            )}

            <div className="cta-row">
              <button 
                className="btn-primary" 
                onClick={() => {
                  emitButtonClick("quiz_confirm_button", { questionId: q.id });
                  confirm();
                }}
              >
                정답 확인 →
              </button>
            </div>
          </>
        )}

        {step === "result" && (
          <ResultPanel
            q={q}
            selected={selected}
            isCorrect={isCorrect}
            onRetry={retry}
            onNext={isLast ? null : next}
            onFinish={finish}
            isLast={isLast}
          />
        )}
      </section>
    </main>
  );
}

/* ----------------- UI 조각 ----------------- */

function Ribbon({ children }) {
  return <div className="ribbon">{children}</div>;
}

function Progress({ total, current }) {
  return (
    <div className="progress">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`dot ${i === current ? "is-active" : ""}`}
          aria-label={`문제 ${i + 1}`}
        />
      ))}
    </div>
  );
}

function ChoiceCircle({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`choice-circle ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`선택지 ${label}`}
    >
      {label}
    </button>
  );
}

function Tile({ label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`tile ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`선택지 ${label}`}
    >
      {label}
    </button>
  );
}

function ResultPanel({ q, selected, isCorrect, onRetry, onNext, onFinish, isLast }) {
  return (
    <div className="result">
      <div className="result-card">
        <div className="result-header">
          <span className={`pill ${isCorrect ? "ok" : "no"}`}>
            {isCorrect ? "정답!" : "오답!"}
          </span>
          <div className="result-question">
            <strong>문제</strong> {q.question}
          </div>
        </div>

        <div className="result-body">
          {q.type === "OX" ? (
            <p>
              <strong>정답</strong> {q.correct}
            </p>
          ) : (
            <p>
              <strong>정답</strong> {q.choices[q.correctIndex]}
            </p>
          )}
          <p className="explain">{q.explain}</p>
        </div>

        <div className="result-actions">
          <button 
            className="btn-secondary" 
            onClick={() => {
              emitButtonClick("quiz_retry_button", { questionId: q.id });
              onRetry();
            }}
          >
            다시 하기
          </button>
          {isLast ? (
            <button 
              className="btn-primary" 
              onClick={() => {
                emitButtonClick("quiz_finish_button", { questionId: q.id });
                onFinish();
              }}
            >
              완료
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => {
                emitButtonClick("quiz_next_button", { questionId: q.id });
                onNext();
              }}
            >
              다음 문제 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}