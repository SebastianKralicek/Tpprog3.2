import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './src/screens/Login'
import Register from "./src/screens/Register";
import HomeMenu from "./src/componentes/HomeMenu"
import ComentPost from './src/screens/ComentPost';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={ {headerShown: false} }/>
          <Stack.Screen name="Register" component={Register} options={ {headerShown: false} }/>
          <Stack.Screen name="HomeMenu" component={HomeMenu} options={ {headerShown: false} }/> 
        </Stack.Navigator>
    </NavigationContainer>
  );
}