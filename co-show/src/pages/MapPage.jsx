import { useNavigate } from "react-router-dom";
import "../styles/map.css";
import MapBackground from "../components/MapBackground.jsx";
import DockNav from "../components/DockNav.jsx";

export default function MapPage() {
  const nav = useNavigate();

  return (
    <main className="map-page">
      <MapBackground>
        {/* 존 카드들 (이미지 없이 버튼만) */}
        <button className="zone zone-main" type="button" onClick={() => nav("/map/all")}>
          전체 지도 보기
        </button>
        <button className="zone zone-a" type="button" onClick={() => nav("/map/a")}>
          A존 보기
        </button>
        <button className="zone zone-b" type="button" onClick={() => nav("/map/b")}>
          B존 보기
        </button>
        <button className="zone zone-c" type="button" onClick={() => nav("/map/c")}>
          C존 보기
        </button>
      </MapBackground>

      <DockNav />
    </main>
  );
}
