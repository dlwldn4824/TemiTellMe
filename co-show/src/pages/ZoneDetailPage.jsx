import { Link, useParams } from "react-router-dom";
import "../styles/map.css";
import MapBackground from "../components/MapBackground.jsx";
import DockNav from "../components/DockNav.jsx";

const ZONE_META = {
  all: { title: "전체 지도", imageLabel: "전체 지도 이미지", descLabel: "전체 지도 설명" },
  a:   { title: "A존",      imageLabel: "A존 맵 이미지",    descLabel: "A존 설명" },
  b:   { title: "B존",      imageLabel: "B존 맵 이미지",    descLabel: "B존 설명" },
  c:   { title: "C존",      imageLabel: "C존 맵 이미지",    descLabel: "C존 설명" },
};

export default function ZoneDetailPage() {
  const { zone } = useParams();
  const meta = ZONE_META[zone] ?? ZONE_META.all;

  return (
    <main className="map-page">
      <MapBackground>
        {/* 중앙 패널 */}
        <section className="zone-panel" role="dialog" aria-label={`${meta.title} 상세`}>
          <header className="zone-panel__header">
            <strong className="zone-panel__title">{meta.title}</strong>
            <Link to="/map" className="zone-panel__close">닫기</Link>
          </header>

          <div className="zone-panel__image" aria-label={meta.imageLabel}>
            {meta.imageLabel}
          </div>

          <div className="zone-panel__desc" aria-label={meta.descLabel}>
            {meta.descLabel}
          </div>
        </section>
      </MapBackground>

      <DockNav />
    </main>
  );
}
