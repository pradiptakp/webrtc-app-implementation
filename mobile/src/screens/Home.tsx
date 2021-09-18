import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Text, TextInput, Title} from 'react-native-paper';
import {AppRoute} from '../navigations/routes';

export const Home: AppScreen<AppRoute.Home> = ({navigation}) => {
  const [username, setUsername] = React.useState('');

  const onStart = () => {
    navigation.navigate(AppRoute.VideoCall, {username});
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={{padding: 12}}>
        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </ScrollView>
      <View style={{padding: 12}}>
        <Button onPress={onStart} mode="contained" disabled={!username}>
          Start Video Call
        </Button>
      </View>
    </View>
  );
};

export default Home;
