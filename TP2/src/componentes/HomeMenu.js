import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import Comments from "../screens/Comments"
import HomePage from "../screens/HomePage"
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function HomeMenu() {
  return (
        <Tab.Navigator>
          <Tab.Screen name="Profie" component={Profile} options={ {headerShown: false,
            tabBarIcon: () => <Feather name="user" size={24} color="black" /> } }/>
          <Tab.Screen name="Comments" component={Comments} options={ {headerShown: false, 
            tabBarIcon: () => <Feather name="plus-square" size={24} color="black" />} }/>
          <Tab.Screen name="HomePage" component={HomePage} options={ {headerShown: false, 
            tabBarIcon: () => <Entypo name="home" size={24} color="black" />} }/>
        </Tab.Navigator>
  );
}