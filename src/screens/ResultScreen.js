// src/screens/ResultScreen.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { TOTAL_QUESTIONS } from '../constants/testConstants';
import useResponsive from '../hooks/useResponsive';
import { estimateOpicLevel, OPIC_LEVEL_LABELS } from '../utils/evaluateResult';

/**
 * savedRecordings: [{ questionNumber, uri }]
 * selfAssessmentLevel: 1~6 (SelfAssessmentScreen에서 선택)
 */
export default function ResultScreen({ savedRecordings, wasForceEnded, selfAssessmentLevel, onRestart }) {
  const { isTablet } = useResponsive();
  const [playingQuestion, setPlayingQuestion] = useState(null);
  const [isGrading, setIsGrading] = useState(true);
  const soundRef = useRef(null);

  useEffect(() => {
    // 실제 채점처럼 보이도록 짧은 로딩을 거친 뒤 모의 등급을 표시합니다.
    const timer = setTimeout(() => setIsGrading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const completionRate = savedRecordings.length / TOTAL_QUESTIONS;
  const levelCode = estimateOpicLevel(selfAssessmentLevel || 3, completionRate);
  const levelLabel = OPIC_LEVEL_LABELS[levelCode];

  const stopPlayback = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {}
      soundRef.current = null;
    }
    setPlayingQuestion(null);
  }, []);

  const togglePlay = useCallback(
    async (item) => {
      if (playingQuestion === item.questionNumber) {
        await stopPlayback();
        return;
      }
      await stopPlayback();
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: item.uri }, { shouldPlay: true });
        soundRef.current = sound;
        setPlayingQuestion(item.questionNumber);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) setPlayingQuestion(null);
        });
      } catch (e) {
        console.warn('[ResultScreen] 재생 실패:', e);
      }
    },
    [playingQuestion, stopPlayback]
  );

  const shareRecording = useCallback(async (item) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) return;
      await Sharing.shareAsync(item.uri);
    } catch (e) {
      console.warn('[ResultScreen] 공유 실패:', e);
    }
  }, []);

  const sortedRecordings = [...savedRecordings].sort((a, b) => a.questionNumber - b.questionNumber);

  if (isGrading) {
    return (
      <View style={styles.gradingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.gradingTitle}>답변을 채점하고 있습니다...</Text>
        <Text style={styles.gradingSubtitle}>잠시만 기다려 주세요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {wasForceEnded ? '시간 종료 — 답변 결과' : '시험 완료 — 답변 결과'}
        </Text>
        <Text style={styles.subtitle}>
          {savedRecordings.length} / {TOTAL_QUESTIONS} 문항 녹음 완료
        </Text>
      </View>

      <View style={styles.evalCard}>
        <Text style={styles.evalCaption}>예상 등급 (모의 평가)</Text>
        <Text style={styles.evalLevel}>{levelCode}</Text>
        <Text style={styles.evalLevelLabel}>{levelLabel}</Text>
        <Text style={styles.evalDisclaimer}>
          실제 OPIc은 공인 채점관이 채점하며, 이 등급은 자기평가 응답과 답변 완료율을 바탕으로 한 모의
          추정치입니다. 실제 평가와 다를 수 있습니다.
        </Text>
      </View>

      <FlatList
        data={sortedRecordings}
        keyExtractor={(item) => String(item.questionNumber)}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.listHeader}>문항별 답변</Text>}
        renderItem={({ item }) => {
          const isPlaying = playingQuestion === item.questionNumber;
          return (
            <View style={[styles.card, isTablet && styles.cardTablet]}>
              <Text style={styles.cardTitle}>Question {item.questionNumber}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.actionButton, isPlaying && styles.actionButtonActive]}
                  onPress={() => togglePlay(item)}
                >
                  <Text style={styles.actionButtonText}>{isPlaying ? '■ 정지' : '▶ 재생'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonOutline} onPress={() => shareRecording(item)}>
                  <Text style={styles.actionButtonOutlineText}>공유하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>저장된 녹음이 없습니다.</Text>}
      />

      <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
        <Text style={styles.restartButtonText}>새 모의고사 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  gradingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  gradingTitle: { color: COLORS.textPrimary, fontSize: FONT.title, fontWeight: '700', marginTop: SPACING.lg },
  gradingSubtitle: { color: COLORS.textSecondary, fontSize: FONT.body, marginTop: SPACING.xs },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  title: { color: COLORS.textPrimary, fontSize: FONT.title + 4, fontWeight: '800', marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT.body },
  evalCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  evalCaption: { color: COLORS.textMuted, fontSize: FONT.caption, fontWeight: '700', marginBottom: SPACING.xs },
  evalLevel: { color: COLORS.accent, fontSize: FONT.timer + 10, fontWeight: '800' },
  evalLevelLabel: { color: COLORS.textPrimary, fontSize: FONT.body, fontWeight: '700', marginBottom: SPACING.sm },
  evalDisclaimer: { color: COLORS.textMuted, fontSize: FONT.caption - 1, textAlign: 'center', lineHeight: 17 },
  listContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  listHeader: { color: COLORS.textPrimary, fontSize: FONT.body, fontWeight: '700', marginBottom: SPACING.sm },
  row: { gap: SPACING.md },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTablet: { maxWidth: '48%' },
  cardTitle: { color: COLORS.textPrimary, fontSize: FONT.body, fontWeight: '700', marginBottom: SPACING.sm },
  cardActions: { flexDirection: 'row', gap: SPACING.sm },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  actionButtonActive: { backgroundColor: COLORS.recording },
  actionButtonText: { color: COLORS.white, fontWeight: '700', fontSize: FONT.caption + 1 },
  actionButtonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  actionButtonOutlineText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: FONT.caption + 1 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
  restartButton: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  restartButtonText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: FONT.button - 2 },
});
