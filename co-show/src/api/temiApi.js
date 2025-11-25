// src/api/temiApi.js
import { fetchRetry } from "../utils/fetchRetry";
import { getTemiSocket } from "../lib/temiSocket";
import { getApiBase } from "../services/apiBase";

const BASE_URL = "/api/temi"; // 서버 쪽에서 이 prefix로 라우팅한다고 가정

// 길안내 시작 로그
export async function logNavigationStart(booth) {
  try {
    const res = await fetchRetry(`${BASE_URL}/navigation/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: booth.id,
        name: booth.name,
        poi: booth.poi,
        time: Date.now(),
      }),
    });

    if (!res.ok) {
      console.error("🚨 logNavigationStart 실패:", res.status);
    }
  } catch (err) {
    console.error("🚨 logNavigationStart 에러:", err);
  }
}

// 도착 로그
export async function logNavigationArrive(booth) {
  try {
    const res = await fetchRetry(`${BASE_URL}/navigation/arrive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: booth.id,
        name: booth.name,
        poi: booth.poi,
        time: Date.now(),
      }),
    });

    if (!res.ok) {
      console.error("🚨 logNavigationArrive 실패:", res.status);
    }
  } catch (err) {
    console.error("🚨 logNavigationArrive 에러:", err);
  }
}

// ============================================
// 이벤트 API 함수들 (Temi SDK/API를 통한 호출)
// ============================================

/**
 * 이벤트 발생 로그 (REST API)
 */
export async function logEvent(eventType, eventData = {}) {
  try {
    const apiBase = getApiBase();
    const res = await fetchRetry(`${apiBase}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: eventType,
        data: eventData,
        timestamp: Date.now(),
      }),
    });

    if (!res.ok) {
      console.error("🚨 logEvent 실패:", res.status);
    }
  } catch (err) {
    console.error("🚨 logEvent 에러:", err);
  }
}

/**
 * 이벤트 발생 (WebSocket을 통한 Temi SDK 호출)
 */
export function emitEvent(eventType, eventData = {}) {
  try {
    const apiBase = getApiBase();
    const socket = getTemiSocket(apiBase);
    
    // WebSocket이 연결되지 않았으면 연결 시도
    if (!socket.isConnected) {
      socket.connect();
    }

    // 이벤트를 WebSocket을 통해 전송
    socket.emitEvent(eventType, eventData);

    // REST API로도 로깅
    logEvent(eventType, eventData);
  } catch (err) {
    console.error("🚨 emitEvent 에러:", err);
    // WebSocket 실패 시 REST API만 사용
    logEvent(eventType, eventData);
  }
}

/**
 * 퀴즈 문제 선택 이벤트
 */
export function emitQuizSelect(questionId, selectedAnswer) {
  emitEvent("quiz_select", {
    questionId,
    selectedAnswer,
  });
}

/**
 * 퀴즈 정답 확인 이벤트
 */
export function emitQuizConfirm(questionId, selectedAnswer, isCorrect) {
  emitEvent("quiz_confirm", {
    questionId,
    selectedAnswer,
    isCorrect,
  });
}

/**
 * 퀴즈 재시도 이벤트
 */
export function emitQuizRetry(questionId) {
  emitEvent("quiz_retry", {
    questionId,
  });
}

/**
 * 퀴즈 다음 문제 이벤트
 */
export function emitQuizNext(questionId, nextQuestionId) {
  emitEvent("quiz_next", {
    questionId,
    nextQuestionId,
  });
}

/**
 * 퀴즈 완료 이벤트
 */
export function emitQuizFinish(totalQuestions, correctCount) {
  emitEvent("quiz_finish", {
    totalQuestions,
    correctCount,
  });
}

/**
 * 버튼 클릭 이벤트
 */
export function emitButtonClick(buttonId, context = {}) {
  emitEvent("button_click", {
    buttonId,
    ...context,
  });
}

/**
 * 페이지 이동 이벤트
 */
export function emitPageNavigation(fromPage, toPage) {
  emitEvent("page_navigation", {
    fromPage,
    toPage,
  });
}

/**
 * 사용자 인터랙션 이벤트
 */
export function emitUserInteraction(interactionType, data = {}) {
  emitEvent("user_interaction", {
    interactionType,
    ...data,
  });
}

/**
 * 테미 춤추기 이벤트 (앞뒤 이동 + 고개 움직임)
 */
export function emitTemiDance(duration = 5000) {
  emitEvent("temi_dance", {
    duration,
    actions: ["move_forward", "move_backward", "head_left", "head_right"],
  });
}

/**
 * 테미 앞으로 이동
 */
export function emitTemiMoveForward(distance = 0.5) {
  emitEvent("temi_move_forward", { distance });
}

/**
 * 테미 뒤로 이동
 */
export function emitTemiMoveBackward(distance = 0.5) {
  emitEvent("temi_move_backward", { distance });
}

/**
 * 테미 고개 왼쪽으로
 */
export function emitTemiHeadLeft(angle = 30) {
  emitEvent("temi_head_left", { angle });
}

/**
 * 테미 고개 오른쪽으로
 */
export function emitTemiHeadRight(angle = 30) {
  emitEvent("temi_head_right", { angle });
}

/**
 * 테미 고개 중앙으로
 */
export function emitTemiHeadCenter() {
  emitEvent("temi_head_center", {});
}
