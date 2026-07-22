// src/components/DifficultyModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { DIFFICULTY_OPTIONS } from '../constants/testConstants';

/**
 * [4. 제약 조건] "7번 문제에서 Next를 누르면, 8번으로 가기 전에
 * '난이도 재조정' 팝업 모달 띄우기 (Easier/Similar/Harder)"
 */
export default function DifficultyModal({ visible, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>난이도를 조정하시겠습니까?</Text>
          <Text style={styles.subtitle}>
            지금까지의 답변을 바탕으로 다음 문항들의 난이도를 선택해주세요.
          </Text>

          <View style={styles.optionsRow}>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={styles.optionButton}
                activeOpacity={0.8}
                onPress={() => onSelect(opt.key)}
              >
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionDescription}>{opt.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.title,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
  },
  optionLabel: {
    color: COLORS.accent,
    fontSize: FONT.body,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    color: COLORS.textMuted,
    fontSize: FONT.caption,
    textAlign: 'center',
  },
});
