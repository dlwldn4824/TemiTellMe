// 3문제 응답 타입
export interface TypeAnswers {
  q1?: boolean;
  q2?: boolean;
  q3?: boolean;
}

// O/X 조합 → 키
export type AnswerKey =
  | "OOO"
  | "OOX"
  | "OXO"
  | "OXX"
  | "XOO"
  | "XOX"
  | "XXO"
  | "XXX";

export interface TypeResultInfo {
  label: string;
  description: string;
  zones: string[];
}

// 8가지 유형 정의
export const RESULT_MAP: Record<AnswerKey, TypeResultInfo> = {
  OOO: {
    label: "에코 메이커형",
    description: "환경·지속가능성을 소프트웨어와 만들기로 풀어내는 타입이에요.",
    zones: ["에코업", "그린바이오"],
  },
  OOX: {
    label: "AI 메이커형",
    description: "AI·보안·IoT를 활용해 직접 무언가를 만들고 싶은 타입이에요.",
    zones: ["데이터보안", "인공지능", "사물인터넷"],
  },
  OXO: {
    label: "환경 데이터 분석형",
    description: "데이터로 환경·사회 문제를 분석하는 걸 좋아하는 타입이에요.",
    zones: ["빅데이터"],
  },
  OXX: {
    label: "디지털 크리에이터형",
    description: "실감미디어·통신 등 디지털 기술을 깊게 다루고 싶은 타입이에요.",
    zones: ["실감미디어", "차세대통신"],
  },
  XOO: {
    label: "에너지 메이커형",
    description: "에너지·신산업 현장에서 직접 만들어 보고 싶은 타입이에요.",
    zones: ["에너지신산업"],
  },
  XOX: {
    label: "로봇·모빌리티 메이커형",
    description: "차·로봇·드론 등 움직이는 하드웨어를 좋아하는 타입이에요.",
    zones: ["미래자동차", "지능형로봇", "항공드론", "반도체소부장"],
  },
  XXO: {
    label: "바이오 연구형",
    description: "바이오·헬스 분야에서 실험과 데이터를 다루고 싶은 타입이에요.",
    zones: ["바이오헬스"],
  },
  XXX: {
    label: "차세대 소재/에너지 연구형",
    description: "소재·배터리·반도체 같은 첨단 기술을 깊게 탐구하고 싶은 타입이에요.",
    zones: ["첨단소재", "이차전지", "차세대 반도체"],
  },
};

// 응답 → 키 문자열 변환
export function answersToKey(ans: { q1: boolean; q2: boolean; q3: boolean }): AnswerKey {
  return (
    (ans.q1 ? "O" : "X") +
    (ans.q2 ? "O" : "X") +
    (ans.q3 ? "O" : "X")
  ) as AnswerKey;
}
