import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/typetest.css"; // 아래 CSS 추가했으면 유지

export default function TypeTest() {
  const nav = useNavigate();

  return (
    <main className="type-start"  /* 데모용 배경색 */ >
      <div className="type-start-page">
        <button
          className="type-start-btn"
          onClick={() => nav("/type/q1")}
        >
            <img />
        </button>
      </div>
    </main>
  );
}

