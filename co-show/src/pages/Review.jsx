import React from "react";
import bgImg from "../assets/review/설문_배경.png";

export default function Review() {
  return (
    <main
      style={{
        width: "1920px",
        height: "1200px",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "nanumRound",
      }}
    >
    </main>
  );
}
