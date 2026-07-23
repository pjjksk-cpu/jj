// src/utils/evaluateResult.js

// 실제 OPIc 등급 체계를 그대로 사용 (Novice Low ~ Superior)
const OPIC_LEVELS = ['NL', 'NM', 'NH', 'IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL', 'AM', 'AH', 'S'];

export const OPIC_LEVEL_LABELS = {
  NL: 'Novice Low',
  NM: 'Novice Mid',
  NH: 'Novice High',
  IL: 'Intermediate Low',
  IM1: 'Intermediate Mid 1',
  IM2: 'Intermediate Mid 2',
  IM3: 'Intermediate Mid 3',
  IH: 'Intermediate High',
  AL: 'Advanced Low',
  AM: 'Advanced Mid',
  AH: 'Advanced High',
  S: 'Superior',
};

/**
 * 모의 추정 등급 계산.
 * 실제 OPIc 채점(발화 정확성/유창성/과제 수행력 등 언어학적 분석)을 대체하지 않으며,
 * 자가진단 레벨(1~6)을 기준점으로, 답변 완료율에 따라 소폭 가감하는 단순 로직입니다.
 */
export function estimateOpicLevel(selfAssessmentLevel, completionRate) {
  const baselineMap = { 1: 1, 2: 3, 3: 5, 4: 7, 5: 8, 6: 9 };
  let index = baselineMap[selfAssessmentLevel] ?? 5;

  if (completionRate >= 1) index += 1;
  else if (completionRate < 0.6) index -= 1;

  index = Math.max(0, Math.min(OPIC_LEVELS.length - 1, index));
  return OPIC_LEVELS[index];
}
