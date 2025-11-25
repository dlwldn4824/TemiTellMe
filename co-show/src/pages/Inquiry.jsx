import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/inquiry.css";

export default function Inquiry() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("inquiry-route");
    return () => document.body.classList.remove("inquiry-route");
  }, []);

  return (
    <div className="inquiry-canvas">

      <img
  src="../assets/inquiry/직원도움.svg"
  alt="직원 도움 받기"
  className="inquiry-btn-img"
  style={{ top: "700px", left: "130px" }}  
  onClick={() => navigate("/inquiry/employee")}
/>

<img
  src="../assets/inquiry/문의.svg"
  alt="문의 남기기"
  className="inquiry-btn-img"
  style={{ top: "900px", left: "130px" }}  
  onClick={() => navigate("/inquiry/justinquiry")}
/>

    </div>
  );
}
