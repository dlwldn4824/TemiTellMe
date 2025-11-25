import { useNavigate } from "react-router-dom";
import "../styles/event-complete.css";

export default function EventFinish() {
  const nav = useNavigate();
  return (
    <main className="done-wrap done-wrap--finish finish-page-bg">
      <div className="finish-top">
        
      </div>
      <div className="phone-actions">
        <button className="cta-btn cta-btn-yes" onClick={()=>nav("/")}>완료</button>
      </div>
    </main>
  );
}


