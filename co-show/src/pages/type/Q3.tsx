// /pages/type/Q3.tsx
import { useLocation, useNavigate } from "react-router-dom";
import TypeQuestion from "./TypeQuestion";
import type { TypeAnswers } from "./typeLogic";
import "./type.css";


export default function Q3() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: TypeAnswers };

  const handleAnswer = (yes: boolean) => {
    const next: TypeAnswers = { ...(state || {}), q3: yes };
    nav("/type/result", { state: next });
  };

  return (
    <TypeQuestion
      title=""
      bg={"/assets/typetest/3Q_bg.svg"}
      onAnswer={handleAnswer}
    />
  );
}
