// src/screens/ResultScreen.js
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING, FONT, RADIUS } from '../styles/theme';
import { TOTAL_QUESTIONS } from '../constants/testConstants';
import useResponsive from '../hooks/useResponsive';

/**
 * 서버/Firebase 없이도 바로 쓸 수 있는 결과 화면.
 * - 문항별로 저장된 답변을 그 자리에서 재생해서 들어볼 수 있고
 * - 안드로이드 공유시트(카카오톡/이메일/드라이브 등)로 파일을 바로 내보낼 수 있습니다.
 *
 * savedRecordings: [{ questionNumber, uri }]
 */
export default function ResultScreen({ savedRecordings, wasForceEnded, onRestart }) {
  const { isTablet } = useResponsive();
  const [playingQuestion, setPlayingQuestion] = useState(null);
  const soundRef = useRef(null);

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
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.uri },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setPlayingQuestion(item.questionNumber);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlayingQuestion(null);
          }
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

  const sortedRecordings = [...savedRecordings].sort(
    (a, b) => a.questionNumber - b.questionNumber
  );

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

      <FlatList
        data={sortedRecordings}
        keyExtractor={(item) => String(item.questionNumber)}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
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
                  <Text style={styles.actionButtonText}>
                    {isPlaying ? '■ 정지' : '▶ 재생'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButtonOutline}
                  onPress={() => shareRecording(item)}
                >
                  <Text style={styles.actionButtonOutlineText}>공유하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>저장된 녹음이 없습니다.</Text>
        }
      />

      <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
        <Text style={styles.restartButtonText}>새 모의고사 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT.title + 4,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT.body,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  row: {
    gap: SPACING.md,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTablet: {
    maxWidth: '48%',
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT.body,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: COLORS.recording,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT.caption + 1,
  },
  actionButtonOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  actionButtonOutlineText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: FONT.caption + 1,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
  restartButton: {
    margin: SPACING.lg,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  restartButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: FONT.button - 2,
  },
});
