export enum AppRoute {
  Home = 'Home',
  VideoCall = 'VideoCall',
}

export type AppStackParamList = {
  Home: undefined;
  VideoCall: {
    username: string;
  };
};
