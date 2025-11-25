import { useNavigate } from "react-router-dom";
import "../styles/InquiryComplete.css";

export default function InquiryCall() {
  const nav = useNavigate();

  return (
    <main className="inquiry-calling">
      <div className="inqury-complete">
        <p className="call-hint">
          직원과 연결 중입니다… 통화가 종료되면 완료를 눌러주세요.
        </p>
        <button
          className="complete-btn"
          onClick={() => nav("/inquiry/complete")}
        />
      </div>
    </main>
  );
}
