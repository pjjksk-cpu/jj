// src/screens/TestScreen.js
import React from 'react';
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
 * selfAssessmentLevel: SelfAssessmentScreen에서 선택한 1~6 레벨 (ResultScreen 모의 채점에 사용)
 * onExitToSurvey: 결과 화면의 "새 모의고사 시작하기" -> 배경 설문부터 다시 시작
 */
export default function TestScreen({ selfAssessmentLevel, onExitToSurvey }) {
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

  if (isCompleted || isForceEnded) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ResultScreen
          savedRecordings={savedRecordings}
          wasForceEnded={isForceEnded}
          selfAssessmentLevel={selfAssessmentLevel}
          onRestart={onExitToSurvey}
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
