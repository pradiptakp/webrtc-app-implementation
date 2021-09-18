import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home';
import VideoCallScreen from '../screens/VideoCall';

import {AppRoute} from './routes';

const Stack = createNativeStackNavigator();

export const AppContainer = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRoute.Home}
        component={HomeScreen}
        options={{title: 'WebRTC & Socket Demo App'}}
      />
      <Stack.Screen
        name={AppRoute.VideoCall}
        component={VideoCallScreen}
        options={{title: 'Video Call'}}
      />
    </Stack.Navigator>
  );
};
