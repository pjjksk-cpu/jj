// src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';

/**
 * 1단계에서는 UI 뼈대만 구성합니다.
 * remainingSeconds, currentQuestion, totalQuestions는
 * 2단계에서 실제 타이머 로직과 연결됩니다.
 */
export default function Header({
  remainingSeconds = 40 * 60,
  currentQuestion = 1,
  totalQuestions = 15,
  isTablet = false,
}) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeLabel = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // 5분 이하로 남으면 경고색으로 전환 (2단계에서 실시간 반영)
  const isTimeWarning = remainingSeconds <= 5 * 60;

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <View
        style={[
          styles.timerBadge,
          isTimeWarning && styles.timerBadgeWarning,
        ]}
      >
        <Text
          style={[
            styles.timerText,
            isTablet && styles.timerTextTablet,
            isTimeWarning && styles.timerTextWarning,
          ]}
        >
          {timeLabel}
        </Text>
      </View>

      <View style={styles.questionBadge}>
        <Text style={[styles.questionText, isTablet && styles.questionTextTablet]}>
          Question {currentQuestion} of {totalQuestions}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  containerTablet: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  timerBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerBadgeWarning: {
    backgroundColor: COLORS.recordingSoft,
    borderColor: COLORS.recording,
  },
  timerText: {
    color: COLORS.textPrimary,
    fontSize: FONT.timer,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerTextTablet: {
    fontSize: FONT.timer + 6,
  },
  timerTextWarning: {
    color: COLORS.recording,
  },
  questionBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
  },
  questionText: {
    color: COLORS.textSecondary,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  questionTextTablet: {
    fontSize: FONT.title,
  },
});
