// Home.jsx
import CardNav from "../components/CardNav.jsx";
import "../styles/Home.css";  // 홈 전용 CSS

export default function Home() {
  return (
    <div className="home-wrapper">
      <CardNav />
      <div className="moving-footer">
        <div className="moving-text">
          본 프로젝트는 we-meet 수업의 프로젝트 결과물로 제작되었습니다.
        </div>
      </div>

    </div>
  );
}
