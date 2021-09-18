/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StatusBar, useColorScheme, View} from 'react-native';
import {AppContainer} from './navigations/AppStack';
import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <NavigationContainer>
      <PaperProvider>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <AppContainer />
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;
