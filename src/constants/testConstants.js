// src/constants/testConstants.js

// [3. 문항별 상태 변화 로직] 요구사항을 그대로 상태(state) 이름으로 매핑
export const QUESTION_STATE = {
  WAIT: 'WAIT',                 // 상태 1: 대기 (Play만 활성화)
  PLAYING: 'PLAYING',           // 상태 2: 1차 질문 재생 중 (전 버튼 비활성화)
  REPLAY_WINDOW: 'REPLAY_WINDOW', // 상태 3: 재생 직후 5초간 Replay 가능
  RECORDING: 'RECORDING',       // 상태 4: 답변 녹음 중 (Next만 활성화)
  NEXT_READY: 'NEXT_READY',     // 상태 5: Next 처리 중(전환 애니메이션용)
};

export const TOTAL_QUESTIONS = 15;
export const TOTAL_TEST_SECONDS = 40 * 60; // 40분
export const REPLAY_WINDOW_SECONDS = 5;    // 정확히 5초
export const DIFFICULTY_ADJUST_AFTER_QUESTION = 7; // 7번 문항 이후 팝업

export const DIFFICULTY_OPTIONS = [
  { key: 'EASIER', label: 'Easier', description: '더 쉬운 주제로' },
  { key: 'SIMILAR', label: 'Similar', description: '비슷한 난이도로' },
  { key: 'HARDER', label: 'Harder', description: '더 어려운 주제로' },
];

// 상태별 안내 텍스트/컬러 키 (UI에서 참조)
export const STATE_META = {
  [QUESTION_STATE.WAIT]: {
    label: 'Ready',
    description: 'Play 버튼을 눌러 문제를 들어보세요',
    colorKey: 'accent',
  },
  [QUESTION_STATE.PLAYING]: {
    label: 'Playing Question',
    description: '질문을 재생하고 있습니다...',
    colorKey: 'playing',
  },
  [QUESTION_STATE.REPLAY_WINDOW]: {
    label: 'Replay Available',
    description: '5초 이내에 다시 듣기가 가능합니다',
    colorKey: 'waiting',
  },
  [QUESTION_STATE.RECORDING]: {
    label: 'Recording',
    description: '답변을 녹음하고 있습니다. 준비되면 Next를 누르세요',
    colorKey: 'recording',
  },
  [QUESTION_STATE.NEXT_READY]: {
    label: 'Saving...',
    description: '답변을 저장하고 있습니다',
    colorKey: 'accent',
  },
};
