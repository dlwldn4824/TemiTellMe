// 지도 배경(초록 + 도로 3개). 자식 콘텐츠를 겹쳐서 올려 씁니다.
export default function MapBackground({ children }) {
  return (
    <section className="map-canvas" aria-label="전시장 배경">
      <div className="road road-a" />
      <div className="road road-b" />
      <div className="road road-c" />
      {children}
    </section>
  );
}
