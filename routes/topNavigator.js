import { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';

import Login from "../screens/login";

import BasicHeader from "../shared/basicHeader";

import DrawerNavigator from "./drawerNavigator";
import CrampStack from "./crampStack";

/*
    TopNavigator allows to navigate between the Login, MainDrawer, and Cramp Stacks the screen that gets loaded first is chosen by if the user flipped the "stay logged in" switch. 
    It also loads all of the fonts before anything else.
*/

function TopNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Check if user didn't want to be logged out. Used to check if you should load the login or maindrawer first.
  useEffect(() => {
    async function init() {
      if (await SecureStore.getItemAsync("isLoggedIn") == "true"){setIsLoggedIn(true)}
      else {setIsLoggedIn(false)}
    }
    init();
  }, []);

  const [fontsLoaded] = useFonts({
    "Monsterrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "SignikaNegative": require("../assets/fonts/SignikaNegative-Regular.ttf"),
  });

  //Show splash screen until fonts load.
  const onLayoutRootView = useCallback(async () => {
  if (fontsLoaded) {
    await SplashScreen.hideAsync();
  }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
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

  const TopNavigator = createStackNavigator();

  return (
    <TopNavigator.Navigator
      initialRouteName={isLoggedIn == true ? "MainDrawer" : "Login"}
      screenOptions={{
        gestureEnabled:false,
        detachPreviousScreen:true,
        animationEnabled: true,
          cardStyleInterpolator: fadeAnimation,
          transitionSpec: {
            open: animationConfig,
            close: animationConfig,
        },
    }}>
      <TopNavigator.Screen
        name="Login"
        component={Login}
        options={{
          header: BasicHeader,
        }}
      />
      <TopNavigator.Screen
        name="MainDrawer"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <TopNavigator.Screen
        name="CrampStack"
        component={CrampStack}
        options={{
          headerShown: false,
        }}
      />
    </TopNavigator.Navigator>
  );
}

export default (
  <NavigationContainer>
    <TopNavigator />
  </NavigationContainer>
);