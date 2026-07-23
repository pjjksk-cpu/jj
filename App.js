// App.js
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import PermissionGate from './src/components/PermissionGate';
import AppFlowScreen from './src/screens/AppFlowScreen';

/**
 * 흐름: 마이크 권한 확인 -> 배경 설문 -> 자가진단 -> 시험 -> 결과(모의 채점)
 */
export default function App() {
  useEffect(() => {
    activateKeepAwakeAsync('opic-exam-session');
    return () => {
      deactivateKeepAwake('opic-exam-session');
    };
  }, []);

  return (
    <SafeAreaProvider>
      <PermissionGate>
        <AppFlowScreen />
      </PermissionGate>
    </SafeAreaProvider>
  );
}
