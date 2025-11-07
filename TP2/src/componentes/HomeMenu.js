import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import CrearPost from "../screens/CrearPost";
import HomePage from "../screens/HomePage"
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function HomeMenu() {
  return (
        <Tab.Navigator>
          <Tab.Screen name="Profile" component={Profile} options={ {headerShown: false,
            tabBarIcon: () => <Feather name="user" size={24} color="black" /> } }/>
          <Tab.Screen name="Crear Posteos" component={CrearPost} options={ {headerShown: false, 
            tabBarIcon: () => <Feather name="plus-square" size={24} color="black" />} }/>
          <Tab.Screen name="HomePage" component={HomePage} options={ {headerShown: false, 
            tabBarIcon: () => <Entypo name="home" size={24} color="black" />} }/>
        </Tab.Navigator>
  );
}