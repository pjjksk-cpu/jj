// src/components/PermissionGate.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import useAudioPermissions, { PERMISSION_STATUS } from '../hooks/useAudioPermissions';

/**
 * [4. 제약 조건] "앱 최초 실행 시 안드로이드 마이크 접근 권한(RECORD_AUDIO)을
 * 반드시 요청하고 예외 처리할 것"
 *
 * - 권한 승인 전: children(TestScreen)을 렌더링하지 않고 안내 화면을 보여줌
 * - "다시 묻지 않음"으로 거부된 경우: 안드로이드 앱 설정 화면으로 바로 이동하는 버튼 제공
 */
export default function PermissionGate({ children }) {
  const { status, canAskAgain, requestPermission } = useAudioPermissions();

  if (status === PERMISSION_STATUS.GRANTED) {
    return children;
  }

  const isHardDenied = status === PERMISSION_STATUS.DENIED && !canAskAgain;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎙️</Text>
      <Text style={styles.title}>마이크 권한이 필요합니다</Text>
      <Text style={styles.description}>
        OPIc 모의고사는 답변 녹음을 위해 마이크 접근 권한이 반드시 필요합니다.
        {'\n'}
        권한을 허용해야 시험을 시작할 수 있습니다.
      </Text>

      {isHardDenied ? (
        <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
          <Text style={styles.buttonText}>설정에서 권한 허용하기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>마이크 권한 허용</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  icon: { fontSize: 56, marginBottom: SPACING.lg },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.title,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT.button,
    fontWeight: '700',
  },
});
