// src/components/ExhibitionGuide.jsx
import React from "react";
import "../styles/ExhibitionGuide.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const Section = styled.section`
  width: 1920px;
  min-height: 1200px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0 auto; /* 고정 폭 중앙 정렬 */

  /* 배경 */
  background-image: url("../assets/ExhibitionGuide/전시장안내.png");
  background-size: 100% 100%;
  background-position: center top;
  background-repeat: no-repeat;

  display: flex;
  justify-content: flex-end; /* 카드 오른쪽으로 */
  align-items: center;
  padding: 80px 10% 120px 10%; /* 아래 여백을 좀 더 줘서 balloon이 안 잘림 */
  color: #1a1a1a;
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, sans-serif;
`;



const ExhibitionGuide = () => {
  const navigate = useNavigate(); // ✅ 페이지 이동 훅

  return (
    <Section>
     {/* 🔵 전체 지도 보기 */}
      <button className="guide-btn blue" onClick={() => navigate("/map")}>
        <div className="icon-box">
          <img src="/assets/ExhibitionGuide/free-icon-search-3434958 2.png" alt="전체 지도 아이콘" />
        </div>
        <h3>전체 지도 보기</h3>
        <p>전시장의 지도를 <br />확인해 보세요</p>
      </button>
      <img
        src="/assets/ExhibitionGuide/free-icon-blue-tit-9254765 2.png"  /* 파일 경로에 맞게 변경 */
        alt="파란 새"
        className="blue-bird"
      />


      {/* 🔴 빠른 길찾기 */}
      <button className="guide-btn red" onClick={() => navigate("/search")}>
        <div className="icon-box">
          <img src="/assets/ExhibitionGuide/Group 32.png" alt="길찾기 아이콘" />
        </div>
        <h3>  지능형로봇 존<br />구경가기</h3>
        <p>원하는 위치까지<br /> 안내해 드릴게요</p>
      </button>

      {/* 🟣 추천 장소 */}
      <button className="guide-btn purple" onClick={() => navigate("/recommend")}>
        <div className="icon-box">
          <img src="/assets/ExhibitionGuide/free-icon-travel-guide-15773474 2.png" alt="추천 장소 아이콘" />
        </div>
        <h3>추천 장소</h3>
        <p>추천을 받고, <br />작품을 감상해 보세요</p>
      </button>
    </Section>
  );
};

export default ExhibitionGuide;
