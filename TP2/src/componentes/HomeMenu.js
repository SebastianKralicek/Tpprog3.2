import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import Comments from "../screens/Comments"
import HomePage from "../screens/HomePage"
import CommentPost from "../screens/ComentPost"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function HomeMenu() {
  return (
        <Tab.Navigator>
          <Stack.Screen name="Profie" component={Profile} options={ {headerShown: false} }/>
          <Stack.Screen name="Comments" component={Comments} options={ {headerShown: false} }/>
          <Stack.Screen name="HomePage" component={HomePage} options={ {headerShown: false} }/>
          <Stack.Screen name="CommentPost" component={CommentPost} options={ {headerShown: false} }/>
        </Tab.Navigator>
  );
}