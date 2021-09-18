/**
 * @format
 */

import {ParamListBase, RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppRoute, AppStackParamList} from './navigations/routes';

declare global {
  interface NavigationProps<
    ParamList extends ParamListBase,
    Route extends keyof ParamList,
  > {
    navigation: NativeStackNavigationProp<ParamList, Route>;
    route: RouteProp<ParamList, Route>;
  }

  type AppScreen<Route extends AppRoute> = React.FC<
    NavigationProps<AppStackParamList, Route>
  >;
}
