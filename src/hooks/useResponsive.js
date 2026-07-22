// src/hooks/useResponsive.js
import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../styles/theme';

/**
 * 화면 크기/방향 변화를 실시간으로 추적하는 훅
 * - 안드로이드 폰 <-> 태블릿, 세로 <-> 가로 회전 시 자동으로 값이 갱신됨
 */
export default function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= BREAKPOINTS.tablet;
  const isLandscape = width > height;

  // 태블릿 가로모드일 때만 우측 사이드바 레이아웃 사용,
  // 그 외(폰, 태블릿 세로모드)는 하단 스크롤 진행도 바 사용
  const useSideProgress = isTablet && isLandscape;

  return {
    width,
    height,
    isTablet,
    isLandscape,
    useSideProgress,
  };
}
