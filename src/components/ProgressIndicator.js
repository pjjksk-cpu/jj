// src/components/ProgressIndicator.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { TOTAL_QUESTIONS } from '../constants/testConstants';

/**
 * useSideProgress = true  -> 태블릿 가로모드: 화면 우측에 세로 스택으로 배치
 * useSideProgress = false -> 모바일 / 태블릿 세로모드: 화면 하단에 가로 스크롤로 배치
 */
export default function ProgressIndicator({
  currentQuestion = 1,
  totalQuestions = TOTAL_QUESTIONS,
  useSideProgress = false,
}) {
  const items = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const renderDot = (num) => {
    const isDone = num < currentQuestion;
    const isActive = num === currentQuestion;
    return (
      <View
        key={num}
        style={[
          styles.dot,
          useSideProgress ? styles.dotSide : styles.dotBottom,
          isDone && styles.dotDone,
          isActive && styles.dotActive,
        ]}
      >
        <Text
          style={[
            styles.dotText,
            (isDone || isActive) && styles.dotTextActive,
          ]}
        >
          {num}
        </Text>
      </View>
    );
  };

  if (useSideProgress) {
    return (
      <View style={styles.sideContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sideScrollContent}
        >
          {items.map(renderDot)}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.bottomContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bottomScrollContent}
      >
        {items.map(renderDot)}
      </ScrollView>
    </View>
  );
}

const DOT_SIZE = 36;

const styles = StyleSheet.create({
  sideContainer: {
    width: 72,
    paddingVertical: SPACING.lg,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  sideScrollContent: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
  },
  bottomScrollContent: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dotSide: {
    marginVertical: 2,
  },
  dotBottom: {
    marginHorizontal: 2,
  },
  dotDone: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  dotActive: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  dotText: {
    color: COLORS.textMuted,
    fontSize: FONT.caption,
    fontWeight: '700',
  },
  dotTextActive: {
    color: COLORS.textPrimary,
  },
});
