// /pages/type/TypeQuestion.tsx
import React from "react";
import "./type.css";

interface Props {
  title: string;
  bg: string;                 // 각 질문별 배경 이미지
  onAnswer: (isYes: boolean) => void;
}

export default function TypeQuestion({ title, bg, onAnswer }: Props) {
  return (
    <main className="type-page">
      <div
        className="type-card"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h2 className="type-q">{title}</h2>

        <div className="type-btns">
          <button
            className="btn-ox btn-o"
            onClick={() => onAnswer(true)}
            aria-label="예"
          />
          <button
            className="btn-ox btn-x"
            onClick={() => onAnswer(false)}
            aria-label="아니오"
          />
        </div>
      </div>
    </main>
  );
}
