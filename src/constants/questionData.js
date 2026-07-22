// src/constants/questionData.js
import { TOTAL_QUESTIONS } from './testConstants';

/**
 * TODO(배포 전 필수 교체):
 * 실제 OPIc 문항 음성 파일로 audioSource를 교체하세요.
 *
 * - 로컬 번들 asset 사용 시:
 *     audioSource: require('../../assets/audio/q1.mp3')
 * - 원격 CDN/서버 파일 사용 시:
 *     audioSource: { uri: 'https://your-cdn.com/opic/questions/q1.mp3' }
 *
 * 두 형식 모두 expo-av의 Audio.Sound.createAsync()에 그대로 전달 가능합니다.
 */
const QUESTIONS = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    prompt: `Question ${num} (placeholder prompt text)`,
    audioSource: { uri: `https://your-cdn.com/opic/questions/q${num}.mp3` },
  };
});

export default QUESTIONS;
