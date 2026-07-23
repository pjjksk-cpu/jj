// src/screens/BackgroundSurveyScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { BACKGROUND_QUESTIONS, INTEREST_CATEGORIES } from '../constants/surveyData';
import SurveyOption from '../components/SurveyOption';

const STEPS = [
  ...BACKGROUND_QUESTIONS.map((q) => ({ ...q, multi: false })),
  ...INTEREST_CATEGORIES.map((c) => ({ ...c, multi: true })),
];

export default function BackgroundSurveyScreen({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = STEPS[stepIndex];
  const currentAnswer = answers[step.id] ?? (step.multi ? [] : null);
  const canProceed = step.multi ? currentAnswer.length > 0 : !!currentAnswer;

  const selectSingle = (key) => {
    setAnswers((prev) => ({ ...prev, [step.id]: key }));
  };

  const toggleMulti = (key) => {
    setAnswers((prev) => {
      const list = prev[step.id] || [];
      const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
      return { ...prev, [step.id]: next };
    });
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.stepCounter}>
          Background Survey {stepIndex + 1} / {STEPS.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{step.title}</Text>
        {step.multi && <Text style={styles.subtitle}>해당하는 항목을 모두 선택하세요 (1개 이상)</Text>}

        {step.options.map((opt) => (
          <SurveyOption
            key={opt.key}
            label={opt.label}
            selected={step.multi ? currentAnswer.includes(opt.key) : currentAnswer === opt.key}
            onPress={() => (step.multi ? toggleMulti(opt.key) : selectSingle(opt.key))}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {stepIndex > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>이전</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          disabled={!canProceed}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {stepIndex === STEPS.length - 1 ? '설문 완료' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  stepCounter: { color: COLORS.textMuted, fontSize: FONT.caption, fontWeight: '700' },
  content: { padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontSize: FONT.title, fontWeight: '700', marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.caption, marginBottom: SPACING.md },
  footer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  backButtonText: { color: COLORS.textSecondary, fontWeight: '700' },
  nextButton: {
    flex: 2,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: COLORS.disabled },
  nextButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONT.button - 2 },
});
