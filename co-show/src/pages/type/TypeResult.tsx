// /pages/type/TypeResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import "./type.css";
import { answersToKey, RESULT_MAP, TypeAnswers, AnswerKey } from "./typeLogic";

const RESULT_IMAGE_MAP: Record<AnswerKey, string> = {
  OOO: "/assets/type/result_OOO.png",
  OOX: "/assets/type/result_OOX.png",
  OXO: "/assets/type/result_OXO.png",
  OXX: "/assets/type/result_OXX.png",
  XOO: "/assets/type/result_XOO.png",
  XOX: "/assets/type/result_XOX.png",
  XXO: "/assets/type/result_XXO.png",
  XXX: "/assets/type/result_XXX.png",
};


export default function TypeResult() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: TypeAnswers };

  // ✅ 테스트 정보 없을 때 (에러 fallback)
  if (!state || state.q1 === undefined || state.q2 === undefined || state.q3 === undefined) {
    return (
      <main className="result-type-page">
        <div className="type-card">
          <div className="type-result">
            <p>테스트 정보가 없습니다. 처음부터 다시 진행해 주세요.</p>
            <button className="btn-primary" onClick={() => nav("/type/q1")}>
              다시 시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const key = answersToKey(state as { q1: boolean; q2: boolean; q3: boolean });
  const result = RESULT_MAP[key]; // label은 alt 텍스트 정도로만 사용

  const resultImg = RESULT_IMAGE_MAP[key];

  return (
    <main className="type-page type-result">
      <div className="type-card">
        <div className="type-result-visual">
          <img src={resultImg} alt={result.label} className="type-result-image" />
        </div>

        <div className="type-result-actions">
          <button className="btn-primary" onClick={() => nav("/map")}>추천 존 확인하기</button>
          <button className="btn-secondary" onClick={() => nav("/")}>끝내기</button>
        </div>
      </div>
    </main>
  );
}
