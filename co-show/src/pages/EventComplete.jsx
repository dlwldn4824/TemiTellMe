import { useNavigate } from "react-router-dom";
import "../styles/event-complete.css";

export default function EventComplete() {
  const nav = useNavigate();

  return (
    <main className="done-wrap">
      <div className="cta">
        <div className="cta-actions">
          <button className="cta-btn cta-btn-yes" onClick={() => nav("/events/phone")}>참여할래요!</button>
          <button className="cta-btn cta-btn-no" onClick={() => nav("/")}>괜찮아요</button>
        </div>
      </div>
    </main>
  );
}
