// src/screens/TestScreen.js
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../styles/theme';
import useResponsive from '../hooks/useResponsive';
import useTestStateMachine from '../hooks/useTestStateMachine';
import { TOTAL_QUESTIONS } from '../constants/testConstants';

import Header from '../components/Header';
import ExaminerSection from '../components/ExaminerSection';
import ProgressIndicator from '../components/ProgressIndicator';
import ControlButtons from '../components/ControlButtons';
import DifficultyModal from '../components/DifficultyModal';
import ResultScreen from './ResultScreen';

/**
 * TestScreen은 "세션"을 감싸는 얇은 래퍼입니다.
 * sessionKey를 바꿔서 <ExamSession>을 통째로 리마운트하면
 * useTestStateMachine의 모든 상태(문항 번호, 녹음 목록, 타이머 등)가 깨끗하게 초기화됩니다.
 * -> "새 모의고사 시작하기"를 눌렀을 때 별도 reset 로직 없이 안전하게 재시작 가능.
 */
export default function TestScreen() {
  const [sessionKey, setSessionKey] = useState(0);
  const handleRestart = useCallback(() => setSessionKey((k) => k + 1), []);

  return <ExamSession key={sessionKey} onRestart={handleRestart} />;
}

function ExamSession({ onRestart }) {
  const { isTablet, useSideProgress } = useResponsive();

  const {
    currentQuestionNumber,
    questionState,
    replayCountdown,
    remainingSeconds,
    savedRecordings,
    showDifficultyModal,
    isForceEnded,
    isCompleted,
    actions,
  } = useTestStateMachine({ permissionGranted: true });

  // 정상 완료(15번까지) 또는 40분 초과 강제 종료 -> 동일한 결과 화면으로 이동
  if (isCompleted || isForceEnded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ResultScreen
          savedRecordings={savedRecordings}
          wasForceEnded={isForceEnded}
          onRestart={onRestart}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <Header
        remainingSeconds={remainingSeconds}
        currentQuestion={currentQuestionNumber}
        totalQuestions={TOTAL_QUESTIONS}
        isTablet={isTablet}
      />

      <View style={styles.body}>
        <View style={styles.mainArea}>
          <ExaminerSection state={questionState} isTablet={isTablet} />
          <ControlButtons
            state={questionState}
            onPlay={actions.onPlay}
            onReplay={actions.onReplay}
            onNext={actions.onNext}
            replayCountdown={replayCountdown}
            isTablet={isTablet}
          />
        </View>

        {useSideProgress && (
          <ProgressIndicator
            currentQuestion={currentQuestionNumber}
            totalQuestions={TOTAL_QUESTIONS}
            useSideProgress
          />
        )}
      </View>

      {!useSideProgress && (
        <ProgressIndicator
          currentQuestion={currentQuestionNumber}
          totalQuestions={TOTAL_QUESTIONS}
          useSideProgress={false}
        />
      )}

      <DifficultyModal visible={showDifficultyModal} onSelect={actions.onSelectDifficulty} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  mainArea: {
    flex: 1,
  },
});
