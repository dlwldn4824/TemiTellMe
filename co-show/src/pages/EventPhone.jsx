import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/event-complete.css";
import { sendPhone } from "../services/phoneCollector";

export default function EventPhone() {
  const [digits, setDigits] = useState(Array(11).fill(""));
  const [activeIdx, setActiveIdx] = useState(0);
  const [touched, setTouched] = useState(false);
  const nav = useNavigate();
  const submittingRef = useRef(false);

  const value = digits.join("");
  const isValid = /^01[016789]\d{7,8}$/.test(value);

  function setDigitAt(index, d) {
    const next = [...digits];
    next[index] = d;
    setDigits(next);
  }

  function handleBoxClick(i) {
    setActiveIdx(i);
  }

  function handleKeyPress(k) {
    setTouched(true);
    if (k === "del") {
      if (digits[activeIdx]) {
        setDigitAt(activeIdx, "");
        return;
      }
      const prev = Math.max(0, activeIdx - 1);
      setActiveIdx(prev);
      setDigitAt(prev, "");
      return;
    }
    if (!/^\d$/.test(k)) return;
    setDigitAt(activeIdx, k);
    setActiveIdx((idx) => Math.min(10, idx + 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    if (!isValid) return;
    if (submittingRef.current) return; // 중복 방지

    try {
      submittingRef.current = true;
      await sendPhone(value);
      nav("/events/finish");
    } catch (err) {
      console.error("Failed to send phone", err);
      alert("휴대폰 번호 제출에 실패했습니다. 다시 시도해 주세요.");
      submittingRef.current = false;
    }
  }

  return (
    <main className="done-wrap done-wrap--phone phone-page-bg">
      <div className="phone-top" />
      <form onSubmit={handleSubmit} className="phone-form">
        <div className="phone-boxes" aria-label="휴대폰 번호 입력 칸">
          <div className="phone-group">
            {[0,1,2].map(i => (
              <button key={i} type="button" className={`phone-box ${activeIdx===i?"is-active":""}`} onClick={() => handleBoxClick(i)}>{digits[i]}</button>
            ))}
          </div>
          <span className="phone-dash">-</span>
          <div className="phone-group">
            {[3,4,5,6].map(i => (
              <button key={i} type="button" className={`phone-box ${activeIdx===i?"is-active":""}`} onClick={() => handleBoxClick(i)}>{digits[i]}</button>
            ))}
          </div>
          <span className="phone-dash">-</span>
          <div className="phone-group">
            {[7,8,9,10].map(i => (
              <button key={i} type="button" className={`phone-box ${activeIdx===i?"is-active":""}`} onClick={() => handleBoxClick(i)}>{digits[i]}</button>
            ))}
          </div>
        </div>
        {touched && !isValid && (
          <p className="error">올바른 휴대폰 번호를 입력해 주세요.</p>
        )}
        <div className="kbd">
          <div className="kbd-row">
            {["1","2","3"].map(k => (
              <button key={k} type="button" className="kbd-key" onClick={()=>handleKeyPress(k)}>{k}</button>
            ))}
          </div>
          <div className="kbd-row">
            {["4","5","6"].map(k => (
              <button key={k} type="button" className="kbd-key" onClick={()=>handleKeyPress(k)}>{k}</button>
            ))}
          </div>
          <div className="kbd-row">
            {["7","8","9"].map(k => (
              <button key={k} type="button" className="kbd-key" onClick={()=>handleKeyPress(k)}>{k}</button>
            ))}
          </div>
          <div className="kbd-row kbd-row-last">
            <button type="button" className="kbd-key kbd-key--wide" onClick={()=>handleKeyPress("0")}>0</button>
            <button type="button" className="kbd-key kbd-key--wide" onClick={()=>handleKeyPress("del")}>지우기</button>
          </div>
        </div>
      </form>
      <div className="phone-actions">
        <button type="submit" className={`cta-btn cta-btn-yes ${isValid ? "is-active" : ""}`} disabled={!isValid} onClick={handleSubmit}>완료</button>
        <button type="button" className="cta-btn cta-btn-no" onClick={()=>nav("/events/complete")}>이전으로</button>
      </div>
    </main>
  );
}


