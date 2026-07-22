// src/components/ExaminerSection.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { QUESTION_STATE, STATE_META } from '../constants/testConstants';

/**
 * 가상 면접관(Ava) 아바타 + 상태 텍스트 + 펄스 애니메이션
 * - PLAYING / RECORDING 상태일 때 아바타 링이 부드럽게 펄스
 * - 실제 오디오 연결은 2단계에서 진행, 여기서는 state 값만 받아 시각화
 */
export default function ExaminerSection({
  state = QUESTION_STATE.WAIT,
  isTablet = false,
}) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const meta = STATE_META[state];
  const activeColor = COLORS[meta.colorKey] || COLORS.accent;
  const activeColorSoft = COLORS[`${meta.colorKey}Soft`] || COLORS.accentSoft;

  const isPulsing =
    state === QUESTION_STATE.PLAYING || state === QUESTION_STATE.RECORDING;

  useEffect(() => {
    let loop;
    if (isPulsing) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (loop) loop.stop();
    };
  }, [isPulsing, pulseAnim]);

  const avatarSize = isTablet ? 220 : 150;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: avatarSize + 24,
            height: avatarSize + 24,
            borderRadius: (avatarSize + 24) / 2,
            borderColor: activeColor,
            backgroundColor: activeColorSoft,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.avatarWrapper,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderColor: activeColor,
            },
          ]}
        >
          {/*
            실제 배포 시 assets/ava-avatar.png 등 실제 이미지로 교체하세요.
            지금은 기본 이니셜 플레이스홀더로 대체합니다.
          */}
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>Ava</Text>
          </View>
        </View>
      </Animated.View>

      <Text style={[styles.stateLabel, { color: activeColor }, isTablet && styles.stateLabelTablet]}>
        {meta.label}
      </Text>
      <Text style={[styles.stateDescription, isTablet && styles.stateDescriptionTablet]}>
        {meta.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  pulseRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: SPACING.lg,
  },
  avatarWrapper: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  avatarPlaceholder: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
  },
  avatarInitial: {
    color: COLORS.textPrimary,
    fontSize: FONT.title,
    fontWeight: '700',
  },
  stateLabel: {
    fontSize: FONT.title,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  stateLabelTablet: {
    fontSize: FONT.title + 4,
  },
  stateDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT.body,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  stateDescriptionTablet: {
    fontSize: FONT.body + 2,
  },
});
