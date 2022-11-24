import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';

import Placeholder from "../screens/placeholder";
import Welcome from '../screens/welcome';
import BasicHeader from '../shared/basicHeader';
import DrawerHeader from "../shared/drawerHeader";

/*
  DrawerNavigator holds the MainScreen and a bunch of lesson screens so that you can always easily navigate between them.
*/

export default function DrawerNavigator() {

  const Drawer = createDrawerNavigator();

  //Need an empty cunstom drawer in order to put it inside a linear gradient inside DrawerNavigator.
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props} style={{flex:1}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }
  
  return (
    <Drawer.Navigator
    drawerContent={(props) => <LinearGradient colors={["#fff","#ffe7dd"]} style={{flex:1}}><CustomDrawerContent {...props} /></LinearGradient>}//
    screenOptions={{
      drawerActiveBackgroundColor:"#c8b0a0",
      drawerInactiveBackgroundColor:"#e3d7cf",
      drawerActiveTintColor:"#353331",
      drawerInactiveTintColor:"#5d5b5a",
      gestureEnabled:false,
      header: DrawerHeader,
    }}
    >
      <Drawer.Screen
        name="Główny Ekran"
        component={Welcome}
        options={{
          header:BasicHeader,
        }}
      />
      <Drawer.Screen
        name="Lekcja 1"
        component={Placeholder}
      />
      <Drawer.Screen
        name="Lekcja 2"
        component={Placeholder}
      />
      <Drawer.Screen
        name="Lekcja 3"
        component={Placeholder}
      />
      <Drawer.Screen
        name="Lekcja 4"
        component={Placeholder}
      />  
    </Drawer.Navigator>
  );
}

const fadeAnimation = ({ current }) => ({
  cardStyle: {
    opacity: current.progress
  },
});
  
const animationConfig = {
  animation: 'spring',
  config: {
    stiffness: 500,
    damping: 2000,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 1,
    restSpeedThreshold: 1,
  },
};
