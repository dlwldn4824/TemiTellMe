// src/components/ZoneMap.jsx
import React, { useState } from "react";
import "./ZoneMap.css";   // 아래 CSS

const ZONES = [
  { id: "media", label: "실감미디어", detail: "실감미디어 관련 전시와 체험 설명..." },
  { id: "console", label: "무대 콘솔", detail: "무대 콘솔, 음향·조명 제어 관련 전시..." },
  { id: "security", label: "데이터보안", detail: "데이터 보안, 개인정보 보호 기술..." },
  { id: "car", label: "미래자동차", detail: "자율주행, 전기차, 모빌리티 관련 전시..." },

  { id: "battery", label: "이차전지", detail: "이차전지 소재·제조 기술..." },
  { id: "biohealth", label: "바이오헬스", detail: "헬스케어, 의료기기 등..." },
  { id: "robot", label: "지능형로봇", detail: "지능형 로봇, 서비스 로봇 전시..." },
  { id: "energy", label: "에너지\n신산업", detail: "신재생 에너지, 수소 등..." },
  { id: "eco", label: "에코업", detail: "친환경·업사이클링 관련 전시..." },

  { id: "bigdata", label: "빅데이터", detail: "데이터 분석·시각화 등..." },
  { id: "display", label: "차세대\n디스플레이", detail: "OLED, 마이크로LED 등..." },
  { id: "ai", label: "인공지능", detail: "AI 모델, 챗봇, 비전 등..." },
  { id: "comm", label: "차세대\n통신", detail: "5G/6G 통신 기술..." },
  { id: "material", label: "첨단소재", detail: "신소재·경량소재 등..." },

  { id: "semiNext", label: "차세대\n반도체", detail: "차세대 반도체 공정, 설계..." },
  { id: "greenbio", label: "그린바이오", detail: "농생명·환경 바이오..." },
  { id: "iot", label: "사물인터넷", detail: "IoT 디바이스·서비스..." },
  { id: "semiPart", label: "반도체\n소부장", detail: "소재·부품·장비..." },
  { id: "drone", label: "항공드론", detail: "드론, UAM, 항공기술..." },
];

export default function ZoneMap() {
  const [selectedId, setSelectedId] = useState(null);

  const selectedZone = ZONES.find(z => z.id === selectedId);

  return (
    <div className="zone-layout">
      <div className="zone-map">
        {ZONES.map(zone => (
          <button
            key={zone.id}
            className={`zone-btn ${zone.id === selectedId ? "selected" : ""}`}
            onClick={() => setSelectedId(zone.id)}
          >
            {zone.label.split("\n").map((line, idx) => (
              <span key={idx}>{line}</span>
            ))}
          </button>
        ))}
      </div>

      <div className="zone-detail">
        {selectedZone ? (
          <>
            <h2>{selectedZone.label.replace("\n", " ")}</h2>
            <p>{selectedZone.detail}</p>
          </>
        ) : (
          <p>영역을 클릭하면 이곳에 세부 정보가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
