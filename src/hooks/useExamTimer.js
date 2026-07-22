// src/hooks/useExamTimer.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { TOTAL_TEST_SECONDS } from '../constants/testConstants';

/**
 * [4. 안드로이드 기기 특화 제약 조건]
 * "전체 시간 40분 초과 시 진행 중인 녹음을 즉시 중지하고 강제 종료 화면으로 이동"
 *
 * 1초 간격 setInterval로 전체 잔여 시간을 관리하고,
 * 0에 도달하면 onExpire 콜백(강제 종료 트리거)을 1회 호출합니다.
 */
export default function useExamTimer({ onExpire } = {}) {
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_TEST_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => setRemainingSeconds(TOTAL_TEST_SECONDS), []);

  useEffect(() => {
    if (!isRunning) return undefined;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          if (onExpireRef.current) onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return { remainingSeconds, isRunning, start, pause, reset };
}
