import { SafeAreaView, StatusBar, BackHandler, Alert, Text, View } from 'react-native';
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { Button, Block } from 'galio-framework';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect  } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

/*
  The welcome screen is used to navigate between lesson screens , cramp screen and login screen.
  It also diplays a welcome message with the users name.
*/

export default function Welcome({navigation}) {
  const [name, setName] = useState("");

  //When the user backpresses exit out of the app instead of going back to the login screen.
  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {BackHandler.exitApp(); return true})
    return () => backHandler.remove()
  })
  
  useEffect(() => {
    const fetchData = async () => {
      const name = await SecureStore.getItemAsync("name");
        if(name != null){
          setName(name);
        }
        else{
          setName("Gościu");
        }
    }
    fetchData()
      .catch(console.error);
  }, []);

  const openDrawer = () => {
    navigation.openDrawer();
  }

  const navigateToCramp = () => {
    navigation.navigate("CrampStack");
  }

  const logout = async () => {
    await SecureStore.setItemAsync("isLoggedIn","false")
    navigation.navigate("Login")
  }

  const logoutAlert = () => {
    Alert.alert(
      "",
      "Czy na pewno chcesz się wylogować?",
      [
        {
          text:"NIE",
          onPress: () => {return}
        },
        {
          text:"TAK",
          onPress: () => logout()
        },
      ]
    )
  }
  
  return ( 
    <LinearGradient colors={["#fff","#ffe7dd"]}>
      <SafeAreaView>
        <StatusBar style="auto" />

        <Block style ={topBlock}>
            <Text style={gladToSeeStyle}>
              Miło Cię widzieć {name}!
            </Text>
        </Block>

        <Block style ={middleBloc}>
          <View style={buttonWrapper}>
            
            <Button
              color="#c8b0a0"
              style={drawerButtonStyle}
              onPress={openDrawer}
            >
              <Feather style={drawerIcon} name="menu" size={30} color="white" onPress={openDrawer}/>
              <Text style={drawerButtonText}>LEKCJE</Text>
            </Button>

            <Button
              color="#c8b0a0"
              style={contractionButtonStyle}
              onPress={navigateToCramp}
            >
              <MaterialCommunityIcons style={stopwatchIcon} name="timer-outline" size={24} color="white" />
              <Text style={contractionButtonText}>SKURCZE</Text>
            </Button> 

          </View>
        </Block>

        <LinearGradient
          colors={["#ffebe2","#c8b0a0"]}
          style={{justifyContent:"center",alignItems: "center",height:"15%"}}
        >
          <Button
          color="#b49e90"
          style={logoutButtonStyle}
          onPress={logoutAlert}>
            <Text style={logoutButtonText}>Wyloguj</Text>
          </Button>
        </LinearGradient>
    
      </SafeAreaView>
    </LinearGradient>
  );
}

const topBlock = {justifyContent:"center",alignItems: "center", height:"30%", width:"80%", alignSelf:"center"}
  const gladToSeeStyle = {fontFamily:"SignikaNegative", color:"#353331", fontSize:40, top:"5%", textAlign:"center",textShadowColor: 'rgba(200, 176, 160, 0.7)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5};
const middleBloc = {height:"55%"}
  const buttonWrapper = {justifyContent:"space-around", alignItems: "center"}
    const drawerButtonStyle = {height:100, width:240, flexDirection:"row", top:"5%"}
      const drawerButtonText = {fontFamily:"Monsterrat", color:"#fff", fontSize:30};
      const drawerIcon = {right:10};
    const contractionButtonStyle = {height:50, width:150, flexDirection:"row", top:50};
      const contractionButtonText = {fontFamily:"Monsterrat", color:"#fff", fontSize:18};
      const stopwatchIcon = {right:5};
      const logoutButtonStyle = {height:40, width:120, flexDirection:"row",}
      const logoutButtonText = {fontFamily:"Monsterrat", color:"#fff", fontSize:18};