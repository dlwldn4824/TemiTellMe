// /pages/type/Q2.tsx
import { useLocation, useNavigate } from "react-router-dom";
import TypeQuestion from "./TypeQuestion";
import type { TypeAnswers } from "./typeLogic";
import "./type.css";

   
export default function Q2() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: TypeAnswers };

  const handleAnswer = (yes: boolean) => {
    const next: TypeAnswers = { ...(state || {}), q2: yes };
    nav("/type/q3", { state: next });
  };

  return (
    <TypeQuestion
      title=""
      bg={"/assets/typetest/2Q_bg.svg"}
      onAnswer={handleAnswer}
    />
  );
}
