
import { useState } from 'react';
import { View, SafeAreaView, StatusBar, Image, Linking, Alert, TouchableOpacity, Text } from 'react-native';
import { Input, Button, Switch } from 'galio-framework';
import { io } from "socket.io-client";
import { LinearGradient } from 'expo-linear-gradient';
//import {encryptData} from "../backend/encryption.js";
import * as SecureStore from 'expo-secure-store';

/*
  Login screen presents the user with 2 inputs for the username and password, a switch for if the user wants to stay logged in, and a log-in button.
  After clicking the log-in button, the username and password get json'd, encrypted, and sent to the server.
  The server then responds with either true or false which either displays a failed login message or navigates the user further.
  Additionaly the server provides the client with the users name to diplay in the welcome screen.
*/

export default function Login({navigation}) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [refreshLength, doRefreshLength] = useState(true);

  //localhost for testing; this should be the servers ip.
  const socket = io("http://127.0.0.1", {
    transports: ['websocket'],
    autoConnect: false
  });

  //Go to the main screen if server returns true, else alert about failed log in.
  socket.on("reply", (msg) => {
    if(msg[0] == "true"){
      saveKeepLoggedValue(keepLoggedIn)
      saveName(msg[1])
      socket.disconnect()
      navigation.navigate("MainDrawer")
    }
    else{
      Alert.alert(
        "Problem z logowaniem",
        "Upewnij się, że login i hasło zostały wpisane poprawnie."
      )
    }
  });
  
  socket.io.on("error", (error) => {
      Alert.alert(
        "Problem z połączeniem do serwera",
        "Upewnij się, że masz dostęp do internetu albo spróbuj ponownie później."
      )
  });

  const queryTheServerAndGetResult = () =>{
    var data = [login, password];
    socket.connect();
    socket.emit('p', encryptData(data));
  }
  
  return (
    <LinearGradient colors={["#fff","#ffe7dd"]}>
      <SafeAreaView>
        <StatusBar style="auto" />

        <View style={topHalf}>
          <Input
              style = {inputStyle}
              rounded = {true}
              bgColor = "#fffcfb"
              color = "#353331"
              placeholderTextColor = "#353331"

              onChangeText={(val) => setLogin(val)}
              placeholder="Login"
              keyboardType="default"
          />
          <Input
              style = {inputStyle}
              rounded = {true}
              bgColor = "#fffcfb"
              color = "#353331"
              placeholderTextColor = "#353331"

              onChangeText={(val) => setPassword(val)}
              placeholder="Hasło"
              keyboardType="default"
              secureTextEntry={true}
          />
        </View>

        <View style = {switchViewStyle}>
          <Button 
            style={buttonStyle}
            color="#c8b0a0"
            onPress={()=>{saveKeepLoggedValue(keepLoggedIn);navigation.navigate("MainDrawer")}}//normally this would be queryTheServerAndGetResult() but for the github version it just navigates you further.
          >
            <Text style={buttonText}>ZALOGUJ</Text>
          </Button>

          <Text style={rememberMeText}>Pozostań zalogowana po wyjściu?</Text>
          <Switch
            style = {switchStyle}
            trackColor={{ false: "#dccfc9", true: "#ffc5ab" }}
            thumbColor="#fff"
            initialValue = {false}
            onChange = {()=>{
              setKeepLoggedIn(!keepLoggedIn)
            }}/>
        </View>

        <View style ={bottomHalf}>
          <TouchableOpacity style = {webTouchable} onPress={openDobryPorodCom}>
          <Image style = {web} source = {require("../assets/web2.png")}/>
          </TouchableOpacity>
        </View>
              
      </SafeAreaView>
    </LinearGradient>
  );
}

const saveName = async (name) => {
  await SecureStore.setItemAsync("name", name);
}

const saveKeepLoggedValue = async (bool) => {
  let stringBool = bool ? "false" : "true"; 
  await SecureStore.setItemAsync("isLoggedIn", stringBool);
}

const openDobryPorodCom = () => {
  Linking.openURL("https://dobryporod.com/");
}

const topHalf = {height: "28%", width: "100%", justifyContent:"center", flexDirection: "column", alignItems: "center"}
  const inputStyle = {width: "80%", borderWidth: 2, borderColor: "#c8b0a0", top:"3%"}
const switchViewStyle = {height: "28%",justifyContent:"center", flexDirection: "column", alignItems: "center"}
  const buttonStyle = {bottom: 10}
    const buttonText = {fontFamily:"Monsterrat", color:"#fff", fontSize:16}
  const switchStyle = {bottom:10}
  const rememberMeText = {fontFamily:"Monsterrat", fontSize:20, color:"#353331",textShadowColor: 'rgba(200, 176, 160, 0.7)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5}
const bottomHalf = {height: "44%", width: "100%",alignItems: "center", justifyContent:"flex-end"}
  const webTouchable = {bottom: 50}
  const web = {aspectRatio:1, height: 100}
