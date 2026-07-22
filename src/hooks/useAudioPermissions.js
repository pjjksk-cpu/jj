// src/hooks/useAudioPermissions.js
import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

export const PERMISSION_STATUS = {
  UNKNOWN: 'UNKNOWN',
  GRANTED: 'GRANTED',
  DENIED: 'DENIED',
};

/**
 * [4. 안드로이드 기기 특화 제약 조건]
 * "앱 최초 실행 시 안드로이드 마이크 접근 권한(RECORD_AUDIO)을 반드시 요청하고 예외 처리할 것"
 *
 * - 마운트 시 자동으로 권한을 1회 요청합니다.
 * - 거부됐지만 다시 물어볼 수 있는 경우(canAskAgain) vs
 *   "다시 묻지 않음"으로 완전히 막힌 경우를 구분해 UI에서 다른 액션을 보여줍니다.
 */
export default function useAudioPermissions() {
  const [status, setStatus] = useState(PERMISSION_STATUS.UNKNOWN);
  const [canAskAgain, setCanAskAgain] = useState(true);

  const requestPermission = useCallback(async () => {
    try {
      const result = await Audio.requestPermissionsAsync();
      setCanAskAgain(result.canAskAgain);
      setStatus(result.granted ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED);

      if (result.granted) {
        // 녹음 가능하도록 오디오 모드 설정 (안드로이드: 다른 소리와 충돌 시 자동 감쇠)
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
      return result.granted;
    } catch (error) {
      // 권한 API 자체가 실패하는 예외 케이스(드문 기기 이슈 등) 방어
      console.warn('[useAudioPermissions] 권한 요청 중 오류 발생:', error);
      setStatus(PERMISSION_STATUS.DENIED);
      return false;
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return { status, canAskAgain, requestPermission };
}
