
import React, { useEffect } from 'react'
import Container from './src/navigation/Container'
import { LogBox } from 'react-native';

const App = () => {

  useEffect(() => {
    LogBox.ignoreAllLogs();
    // setTimeout(() => {
    // RNBootSplash.hide({fade: true});
    // }, 2000);
  }, []);

  return (
    <Container />
  )
}

export default App