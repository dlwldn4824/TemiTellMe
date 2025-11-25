import { useNavigate } from "react-router-dom";
import "../styles/InquiryComplete.css";

export default function EventComplete() {
  const nav = useNavigate();

  return (
    <main className="inquiry-complete-wrap">
      <div className="inqury-complete">
          <button className="complete-btn" onClick={() => nav("/")}></button>
          <button className="back-btn" onClick={() => nav(-1)}></button>
      </div>
    </main>
  );
}
