import { useNavigate } from "react-router-dom";
import styles from "./CardNav.module.css";
import { emitButtonClick, emitPageNavigation } from "../api/temiApi";

const cards = [
  { title: "전시장 안내", to: "/guide", cls: "card01" },
  { title: "경진 대회 일정", to: "/schedule", cls: "card02" },
  { title: "이벤트 참여", to: "/quizIntro", cls: "card03" },
  { title: "현장 줄서기", to: "/line", cls: "card04" },
  { title: "사진 촬영", to: "/photo", cls: "card05" },
  { title: "문의", to: "/inquiry", cls: "card06" }, 
];

export default function CardNav() {
  const nav = useNavigate();

  const handleCardClick = (card) => {
    emitButtonClick(`card_nav_${card.cls}`, { title: card.title, to: card.to });
    emitPageNavigation("home", card.to);
    nav(card.to);
  };

  return (
    <section className="container">
      <div className={styles.wrap}>
        {cards.map((card) => (
          <button
            key={card.to}
            className={`${styles.card} ${styles[card.cls]}`}
            onClick={() => handleCardClick(card)}
            aria-label={card.title}
          >
          </button>
        ))}
      </div>
    </section>
  );
}
