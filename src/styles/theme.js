// src/styles/theme.js
// OPIc 실제 시험 화면 톤(다크 네이비 + 포인트 컬러)을 참고한 디자인 토큰

export const COLORS = {
  background: '#0B1220',       // 메인 배경 (짙은 네이비)
  surface: '#141E33',          // 카드/패널 배경
  surfaceElevated: '#1C2740',  // 살짝 떠있는 패널
  border: '#2A3654',

  textPrimary: '#F5F7FA',
  textSecondary: '#9AA6C3',
  textMuted: '#5D6B8C',

  accent: '#4C8DFF',           // 메인 포인트(파랑)
  accentSoft: 'rgba(76, 141, 255, 0.15)',

  recording: '#FF4D5E',        // 녹음 중 (빨강)
  recordingSoft: 'rgba(255, 77, 94, 0.15)',

  playing: '#22C55E',          // 재생 중 (초록)
  playingSoft: 'rgba(34, 197, 94, 0.15)',

  waiting: '#F5A623',          // 대기/리플레이 윈도우 (주황)
  waitingSoft: 'rgba(245, 166, 35, 0.15)',

  disabled: '#33405F',
  disabledText: '#5D6B8C',

  white: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const FONT = {
  timer: 32,
  title: 20,
  body: 16,
  caption: 13,
  button: 18,
};

// 브레이크포인트: 600dp 이상을 태블릿으로 간주 (구글 권장 기준)
export const BREAKPOINTS = {
  tablet: 600,
};
