// src/screens/AppFlowScreen.js
import React, { useState } from 'react';
import BackgroundSurveyScreen from './BackgroundSurveyScreen';
import SelfAssessmentScreen from './SelfAssessmentScreen';
import TestScreen from './TestScreen';

const PHASE = {
  BACKGROUND: 'BACKGROUND',
  SELF_ASSESSMENT: 'SELF_ASSESSMENT',
  TEST: 'TEST',
};

/**
 * 실제 OPIc 순서를 그대로 반영:
 * 배경 설문(Background Survey) -> 자가진단(Self-Assessment) -> 시험(Test) -> 결과
 * 결과 화면에서 "새 모의고사 시작하기"를 누르면 배경 설문부터 다시 시작합니다.
 */
export default function AppFlowScreen() {
  const [phase, setPhase] = useState(PHASE.BACKGROUND);
  const [surveyAnswers, setSurveyAnswers] = useState(null);
  const [selfLevel, setSelfLevel] = useState(null);

  if (phase === PHASE.BACKGROUND) {
    return (
      <BackgroundSurveyScreen
        onComplete={(answers) => {
          setSurveyAnswers(answers);
          setPhase(PHASE.SELF_ASSESSMENT);
        }}
      />
    );
  }

  if (phase === PHASE.SELF_ASSESSMENT) {
    return (
      <SelfAssessmentScreen
        onComplete={(level) => {
          setSelfLevel(level);
          setPhase(PHASE.TEST);
        }}
      />
    );
  }

  return (
    <TestScreen
      selfAssessmentLevel={selfLevel}
      surveyAnswers={surveyAnswers}
      onExitToSurvey={() => setPhase(PHASE.BACKGROUND)}
    />
  );
}
