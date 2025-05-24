
import React, { useEffect } from 'react'
import Container from './src/navigation/Container'
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
// import store from './src/redux/store';

const App = () => {

  useEffect(() => {
    LogBox.ignoreAllLogs();
    // setTimeout(() => {
    // RNBootSplash.hide({fade: true});
    // }, 2000);
  }, []);

  return (
    // <Provider store={store}>
      <Container />
    // </Provider>
  )
}

export default App