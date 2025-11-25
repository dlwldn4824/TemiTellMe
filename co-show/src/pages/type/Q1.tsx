// /pages/type/Q1.tsx
import { useNavigate } from "react-router-dom";
import TypeQuestion from "./TypeQuestion";
import type { TypeAnswers } from "./typeLogic";
import "./type.css";


export default function Q1() {
  const nav = useNavigate();

  const handleAnswer = (yes: boolean) => {
    const state: TypeAnswers = { q1: yes };
    nav("/type/q2", { state });
  };

  return (
    <TypeQuestion
      title=""
      bg={"/assets/typetest/1Q_bg.svg"}
      onAnswer={handleAnswer}
    />
  );
}
