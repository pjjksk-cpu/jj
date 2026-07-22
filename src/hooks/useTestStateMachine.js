// src/hooks/useTestStateMachine.js
import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  QUESTION_STATE,
  TOTAL_QUESTIONS,
  REPLAY_WINDOW_SECONDS,
  DIFFICULTY_ADJUST_AFTER_QUESTION,
} from '../constants/testConstants';
import QUESTIONS from '../constants/questionData';
import useExamTimer from './useExamTimer';

const RECORDINGS_DIR = `${FileSystem.documentDirectory}opic_recordings/`;

async function ensureRecordingsDir() {
  const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, { intermediates: true });
  }
}

/**
 * [3. 문항별 상태 변화 로직] 전체를 담당하는 핵심 훅.
 *
 * 상태 1 (WAIT)          : Play만 활성화
 * 상태 2 (PLAYING)       : 1차 재생, 전 버튼 비활성화
 * 상태 3 (REPLAY_WINDOW) : 재생 종료 직후 정확히 5초간 Replay 활성화, 시간 초과 시 자동 RECORDING 전이
 * 상태 4 (RECORDING)     : 즉시 녹음 시작, Next만 활성화
 * 상태 5 (Next)          : 녹음 종료 + 로컬 저장 + 다음 문항 WAIT로 이동 (7번은 난이도 모달 경유)
 *
 * + 전체 40분 타이머 초과 시 녹음 즉시 중단 및 강제 종료 플래그 설정
 */
export default function useTestStateMachine({ permissionGranted }) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [questionState, setQuestionState] = useState(QUESTION_STATE.WAIT);
  const [replayCountdown, setReplayCountdown] = useState(null);
  const [savedRecordings, setSavedRecordings] = useState([]); // [{ questionNumber, uri }]
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [isForceEnded, setIsForceEnded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const soundRef = useRef(null);
  const recordingRef = useRef(null);
  const replayTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const clearReplayTimer = () => {
    if (replayTimerRef.current) {
      clearInterval(replayTimerRef.current);
      replayTimerRef.current = null;
    }
  };

  // ---------------------------------------------------------------------
  // 전체 40분 타이머 초과 -> 강제 종료
  // ---------------------------------------------------------------------
  const forceEndExam = useCallback(async () => {
    clearReplayTimer();
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) {
        // 이미 중지된 경우 등은 무시
      }
      recordingRef.current = null;
    }
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (e) {}
      soundRef.current = null;
    }
    if (isMountedRef.current) setIsForceEnded(true);
  }, []);

  const examTimer = useExamTimer({ onExpire: forceEndExam });

  useEffect(() => {
    isMountedRef.current = true;
    if (permissionGranted) {
      examTimer.start();
    }
    return () => {
      isMountedRef.current = false;
      examTimer.pause();
      clearReplayTimer();
      if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionGranted]);

  // ---------------------------------------------------------------------
  // 상태 4: Recording — 즉시 녹음 시작
  // ---------------------------------------------------------------------
  const startRecording = useCallback(async () => {
    if (!isMountedRef.current || !permissionGranted) return;
    try {
      setQuestionState(QUESTION_STATE.RECORDING);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
    } catch (error) {
      console.warn('[useTestStateMachine] 녹음 시작 실패:', error);
    }
  }, [permissionGranted]);

  // ---------------------------------------------------------------------
  // 상태 3: Replay Window — 정확히 5초, 초과 시 자동으로 녹음 시작
  // ---------------------------------------------------------------------
  const startReplayWindow = useCallback(() => {
    if (!isMountedRef.current) return;
    setQuestionState(QUESTION_STATE.REPLAY_WINDOW);
    setReplayCountdown(REPLAY_WINDOW_SECONDS);

    clearReplayTimer();
    replayTimerRef.current = setInterval(() => {
      setReplayCountdown((prev) => {
        if (prev <= 1) {
          clearReplayTimer();
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [startRecording]);

  const replayQuestionAudio = useCallback(async () => {
    // Replay는 REPLAY_WINDOW 상태에서만 호출 가능 (ControlButtons에서 이미 비활성화 처리됨)
    clearReplayTimer();
    setReplayCountdown(null);
    try {
      setQuestionState(QUESTION_STATE.PLAYING);
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
        soundRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish && isMountedRef.current) {
            startRecording();
          }
        });
      } else {
        // 사운드 인스턴스가 유실된 예외 상황 방어: 바로 녹음으로 진행
        startRecording();
      }
    } catch (error) {
      console.warn('[useTestStateMachine] 다시 듣기 실패:', error);
      startRecording();
    }
  }, [startRecording]);

  // ---------------------------------------------------------------------
  // 상태 1 -> 2: Play — 1차 질문 재생
  // ---------------------------------------------------------------------
  const playQuestionAudio = useCallback(async () => {
    if (!permissionGranted) return;
    try {
      setQuestionState(QUESTION_STATE.PLAYING);
      const question = QUESTIONS[currentQuestionNumber - 1];

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(question.audioSource, {
        shouldPlay: true,
      });
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && isMountedRef.current) {
          startReplayWindow();
        }
      });
    } catch (error) {
      console.warn('[useTestStateMachine] 질문 오디오 재생 실패:', error);
      // 오디오 소스 문제로 재생 자체가 실패해도 시험 흐름이 멈추지 않도록
      // 리플레이 윈도우를 생략하고 바로 녹음 단계로 폴백합니다.
      if (isMountedRef.current) startRecording();
    }
  }, [currentQuestionNumber, permissionGranted, startReplayWindow, startRecording]);

  // ---------------------------------------------------------------------
  // 다음 문항으로 이동 (WAIT로 리셋)
  // ---------------------------------------------------------------------
  const advanceToNextQuestion = useCallback(() => {
    setCurrentQuestionNumber((prev) => Math.min(prev + 1, TOTAL_QUESTIONS));
    setQuestionState(QUESTION_STATE.WAIT);
    setReplayCountdown(null);
  }, []);

  // ---------------------------------------------------------------------
  // 상태 5: Next — 녹음 종료 + 로컬 저장 + (7번이면 난이도 모달) 다음 문항 이동
  // ---------------------------------------------------------------------
  const handleNext = useCallback(async () => {
    if (questionState !== QUESTION_STATE.RECORDING) return;
    setQuestionState(QUESTION_STATE.NEXT_READY);

    let savedUri = null;
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const tempUri = recordingRef.current.getURI();
        recordingRef.current = null;

        if (tempUri) {
          await ensureRecordingsDir();
          const destUri = `${RECORDINGS_DIR}q${currentQuestionNumber}_${Date.now()}.m4a`;
          await FileSystem.moveAsync({ from: tempUri, to: destUri });
          savedUri = destUri;
        }
      }
    } catch (error) {
      console.warn('[useTestStateMachine] 녹음 저장 실패:', error);
    }

    if (savedUri) {
      setSavedRecordings((prev) => [
        ...prev.filter((r) => r.questionNumber !== currentQuestionNumber),
        { questionNumber: currentQuestionNumber, uri: savedUri },
      ]);
    }

    if (!isMountedRef.current) return;

    // 15번 문항까지 정상적으로 마친 경우 -> 결과 화면으로 전환 (더 이상 다음 문항 없음)
    if (currentQuestionNumber === TOTAL_QUESTIONS) {
      examTimer.pause();
      setIsCompleted(true);
      return;
    }

    // [4. 제약 조건] 7번 문제 Next 시 난이도 재조정 팝업
    if (currentQuestionNumber === DIFFICULTY_ADJUST_AFTER_QUESTION) {
      setShowDifficultyModal(true);
      return; // 모달에서 옵션 선택 후 advanceToNextQuestion() 호출
    }

    advanceToNextQuestion();
  }, [currentQuestionNumber, questionState, advanceToNextQuestion, examTimer]);

  const handleDifficultySelect = useCallback(
    (optionKey) => {
      // optionKey: 'EASIER' | 'SIMILAR' | 'HARDER'
      // TODO(3단계): optionKey를 백엔드로 전송하여 8~15번 문항 세트를 재조정 요청
      console.log('[Difficulty] 선택된 옵션:', optionKey);
      setShowDifficultyModal(false);
      advanceToNextQuestion();
    },
    [advanceToNextQuestion]
  );

  return {
    currentQuestionNumber,
    questionState,
    replayCountdown,
    remainingSeconds: examTimer.remainingSeconds,
    savedRecordings,
    showDifficultyModal,
    isForceEnded,
    isCompleted,
    actions: {
      onPlay: playQuestionAudio,
      onReplay: replayQuestionAudio,
      onNext: handleNext,
      onSelectDifficulty: handleDifficultySelect,
    },
  };
}
