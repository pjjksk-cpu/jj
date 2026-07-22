// src/components/ControlButtons.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { QUESTION_STATE } from '../constants/testConstants';

/**
 * [3. 상태 변화 로직]에 따른 버튼 활성화 규칙 (1단계에서는 규칙만 반영, 실제 이벤트는 2단계에서 연결)
 * - WAIT           : Play만 활성화
 * - PLAYING        : 전부 비활성화
 * - REPLAY_WINDOW  : Replay만 활성화 (5초 한정)
 * - RECORDING      : Next만 활성화
 */
function getEnabledButtons(state) {
  switch (state) {
    case QUESTION_STATE.WAIT:
      return { play: true, replay: false, next: false };
    case QUESTION_STATE.PLAYING:
      return { play: false, replay: false, next: false };
    case QUESTION_STATE.REPLAY_WINDOW:
      return { play: false, replay: true, next: false };
    case QUESTION_STATE.RECORDING:
      return { play: false, replay: false, next: true };
    default:
      return { play: false, replay: false, next: false };
  }
}

export default function ControlButtons({
  state = QUESTION_STATE.WAIT,
  onPlay = () => {},
  onReplay = () => {},
  onNext = () => {},
  replayCountdown = null, // 2단계에서 REPLAY_WINDOW 동안 남은 초를 전달 (예: 5,4,3...)
  isTablet = false,
}) {
  const enabled = getEnabledButtons(state);

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      <ControlButton
        label="Replay"
        icon="↺"
        onPress={onReplay}
        disabled={!enabled.replay}
        isTablet={isTablet}
        badge={
          enabled.replay && replayCountdown != null ? String(replayCountdown) : null
        }
      />
      <ControlButton
        label="Play"
        icon="▶"
        onPress={onPlay}
        disabled={!enabled.play}
        isTablet={isTablet}
        primary
      />
      <ControlButton
        label="Next"
        icon="❯"
        onPress={onNext}
        disabled={!enabled.next}
        isTablet={isTablet}
      />
    </View>
  );
}

function ControlButton({ label, icon, onPress, disabled, primary, isTablet, badge }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.button,
        isTablet && styles.buttonTablet,
        primary && !disabled && styles.buttonPrimary,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.icon,
          isTablet && styles.iconTablet,
          disabled && styles.iconDisabled,
        ]}
      >
        {icon}
      </Text>
      <Text
        style={[
          styles.label,
          isTablet && styles.labelTablet,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
      {badge != null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  containerTablet: {
    paddingVertical: SPACING.xl,
  },
  button: {
    // 안드로이드 터치 최소 권장 크기(48dp)를 넉넉히 상회하도록 설계
    minWidth: 96,
    minHeight: 88,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  buttonTablet: {
    minWidth: 140,
    minHeight: 120,
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  buttonDisabled: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.disabled,
  },
  icon: {
    fontSize: 26,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  iconTablet: {
    fontSize: 34,
  },
  iconDisabled: {
    color: COLORS.disabledText,
  },
  label: {
    fontSize: FONT.button,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  labelTablet: {
    fontSize: FONT.button + 2,
  },
  labelDisabled: {
    color: COLORS.disabledText,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.waiting,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: FONT.caption,
    fontWeight: '800',
  },
});
