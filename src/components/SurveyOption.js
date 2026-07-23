// src/components/SurveyOption.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';

export default function SurveyOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  optionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentSoft,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT.body,
    fontWeight: '600',
  },
  labelSelected: {
    color: COLORS.accent,
  },
});
