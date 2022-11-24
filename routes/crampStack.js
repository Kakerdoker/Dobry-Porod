import { createStackNavigator } from '@react-navigation/stack'

import Welcome from "../screens/welcome";
import Cramp from "../screens/cramp";
import CrampInfo from "../screens/crampInfo";

import BasicHeader from "../shared/basicHeader";
import CrampsHeader from "../shared/crampsHeader";
import PushToCrampsHeader from "../shared/pushToCrampsHeader";

/*
  CrampStack has Cramp and CrampInfo, needed to seperate them from the Welcome screen so it wouldn't inherit the drawer.
*/

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

export default function CrampStack() {

  const CrampStack = createStackNavigator();

  return (
    <CrampStack.Navigator
      screenOptions={{
        cardStyleInterpolator: fadeAnimation,
        transitionSpec: {
          open: animationConfig,
          close: animationConfig,
        },
    }}>
      <CrampStack.Screen
        name="Cramp"
        component={Cramp}
        options={{
          header: CrampsHeader,
        }}
      />
      <CrampStack.Screen
        name="CrampInfo"
        component={CrampInfo}
        options={{
          header: PushToCrampsHeader,
        }}
      />
    </CrampStack.Navigator>
  );
}
