// src/screens/SelfAssessmentScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { SELF_ASSESSMENT_LEVELS } from '../constants/surveyData';

export default function SelfAssessmentScreen({ onComplete }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Self-Assessment</Text>
        <Text style={styles.subtitle}>
          아래 설명 중 본인의 영어 말하기 수준과 가장 가까운 것을 선택하세요.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {SELF_ASSESSMENT_LEVELS.map((item) => {
          const selected = selectedLevel === item.level;
          return (
            <TouchableOpacity
              key={item.level}
              style={[styles.card, selected && styles.cardSelected]}
              activeOpacity={0.85}
              onPress={() => setSelectedLevel(item.level)}
            >
              <Text style={[styles.cardLabel, selected && styles.cardLabelSelected]}>{item.label}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedLevel && styles.nextButtonDisabled]}
          disabled={!selectedLevel}
          onPress={() => onComplete(selectedLevel)}
        >
          <Text style={styles.nextButtonText}>시험 시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontSize: FONT.title + 2, fontWeight: '800', marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.body },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentSoft },
  cardLabel: { color: COLORS.textPrimary, fontWeight: '800', marginBottom: SPACING.xs },
  cardLabelSelected: { color: COLORS.accent },
  cardDescription: { color: COLORS.textSecondary, fontSize: FONT.caption, lineHeight: 19 },
  footer: { padding: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  nextButton: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: COLORS.disabled },
  nextButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONT.button },
});
