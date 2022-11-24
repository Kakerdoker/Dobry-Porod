import { useState, useEffect, useLayoutEffect } from "react";
import { Modal, SafeAreaView, Text, View, ScrollView, StatusBar } from 'react-native';
import { Button } from 'galio-framework';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

import {interperetContractions} from "../backend/contractionInterpreter.js";

import ContractionInterpretationModal from "./modals/contractionInterpretationModal";
import AgreementModal from "./modals/agreementModal";

/*
  Cramp screen lets the user click a button to start counting the length of a contraction and and then click it again to stop counting it.
  Contractions alongside their lengths and intervals are shown to the user on screen.
  The data gets saved after every button click.
  This screen also contains the agreement modal to make the user agrees to certain terms and a contraction interpretation modal to show specific messages to the user depending on their contractions.
*/

export default function Cramp({navigation}) {
  //Contraction data
  const [amountOfContractions, setAmountOfContractions] = useState(0);
  const [isContractionActive, setIsContractionActive] = useState(false);
  const [startOfContractions, setStartOfContractions] = useState([]);
  const [endOfContractions, setEndOfContractions] = useState([]);

  //Arrays for components to be shown on screen
  const [allContractionBubbles, setAllContractionBubbles ] = useState()
  const [allLengthText, setAllLengthText] = useState()
  const [allIntervalText, setAllIntervalText] = useState()

  //Refresh hooks used to allow for rendering a second time from a useEffect.
  const [refreshLength, doRefreshLength] = useState(true);
  const [refreshLengthBubblesIntervals, doRefreshLengthBubblesIntervals] = useState(false);
  const [interperet, doInterperet] = useState(true);

  //Index for a message sent to the interpretation modal.
  const [interpretationModalIndex, setInterpretationModalIndex] = useState(0);

  //Set the interpretationModalIndex used in contractionInterpretationModal.js after the interpret value changes.
  useEffect(()=>{
    const asyncWrapper = async () => {
      setInterpretationModalIndex(await interperetContractions(startOfContractions,endOfContractions));
    }
    asyncWrapper()
  },[interperet])
  
  //Load saved data, if one value is null then reset everything. At the end refresh hooks.
  useEffect(() => {
    const loadContractionData = async () => {
      return ({
        "amountOfContractions": JSON.parse(await SecureStore.getItemAsync("amountOfContractions")),
        "isContractionActive": JSON.parse(await SecureStore.getItemAsync("isContractionActive")),
        "startOfContractions": JSON.parse(await SecureStore.getItemAsync("startOfContractions")),
        "endOfContractions": JSON.parse(await SecureStore.getItemAsync("endOfContractions"))
      })
    }
    const putSavedDataIntoVariables = async () => {
      const data = await loadContractionData();
      if(data.amountOfContractions == null || data.isContractionActive == null || data.startOfContractions == null || data.endOfContractions == null){
        setAmountOfContractions(0)
        setIsContractionActive(false)
        setStartOfContractions([])
        setEndOfContractions([])
      }
      else{
        setAmountOfContractions(data.amountOfContractions)
        setIsContractionActive(data.isContractionActive)
        setStartOfContractions(data.startOfContractions)
        setEndOfContractions(data.endOfContractions)
      }
      doRefreshLengthBubblesIntervals(!refreshLengthBubblesIntervals);
    }
    putSavedDataIntoVariables()
  }, []);

  //Change refreshLength every second to trigger the useEffect below.
  useEffect(() => {
    const id = setInterval(() => doRefreshLength((refreshLength) => !refreshLength), 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  //Make the current contraction length refresh every second, so that it may change if contraction is active.
  useEffect(()=>{
    createViewsStoringLengthTextAndPutItIntoAHook();
  },[refreshLength])

  const refreshCrampLengthsIntervalsAndBubbles = () => {
    createViewsStoringLengthTextAndPutItIntoAHook()
    createViewsStoringContractionBubblesAndPutItIntoAHook()
    createViewsStoringIntervalTextAndPutItIntoAHook()
    if(amountOfContractions !== 0){ // checks if it's 0 so if the user leaves the screen before amountOfContractions is set it doesn't delete them all.
      saveContractionDataToJson();
    }
  }
  
  useLayoutEffect(() => {
    refreshCrampLengthsIntervalsAndBubbles()
  }, [refreshLengthBubblesIntervals]);

  const monthNames = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze","Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];

  //Create variables for bubble component for every contraction.
  const createArrayOfVariablesUsedInContractionBubblesForEveryContraction = () => {
    var contractionHolder = [];
    for (var i = 0; i < amountOfContractions; i++) {
      contractionHolder.push({
        id: i,
        containerStyle:{
          height: 90,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-around",
        },
        bubbleStyle: {
          backgroundColor: "#c8b0a0",
          height: 50,
          width: 50,
          borderRadius:25,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",shadowOffset: {	width: 0,	height: 4,},shadowOpacity: 0.32,shadowRadius: 5.46,elevation: 9,  //moze zmien kolor cienia 
        },
        text: i+1,
        hourAndMinutes: new Date(startOfContractions[i]).getHours() + ":" + (new Date(startOfContractions[i]).getMinutes().toString().length != 2 ? "0"+ (new Date(startOfContractions[i]).getMinutes()).toString() : new Date(startOfContractions[i]).getMinutes()),
        date: new Date(startOfContractions[i]).getDate() + " " + monthNames[new Date(startOfContractions[i]).getMonth()]
    })}
    return contractionHolder;
  }

  //Map an array of bubble variables to a component and store it inside a hook.
  const createViewsStoringContractionBubblesAndPutItIntoAHook = () => {
    setAllContractionBubbles(createArrayOfVariablesUsedInContractionBubblesForEveryContraction().map(contractionInfo => (
      <View key={contractionInfo.id} style={contractionInfo.containerStyle}>
        <View style={contractionInfo.bubbleStyle}>
          <Text style = {circleIndexText}>{contractionInfo.text}</Text>
        </View>
        <Text style={dateText}>{contractionInfo.date + " " + contractionInfo.hourAndMinutes}</Text>
      </View>
    )))
  }   

  //Create variables for interval component for every contraction.
  const createArrayOfVariablesUsedInIntervalTextForEveryContraction = () => {
    var intervalHolder = [];
    for (var i = 0; i < amountOfContractions; i++) {
      intervalHolder.push({
        id: 2000+i,
        style: {
          //Po to zeby byly widoczne tylko juz dokonane skurcze.
          height: amountOfContractions > i && !isNaN(new Date(startOfContractions[i] - endOfContractions[i-1])) ? 50 : 0,
          width: amountOfContractions > i ? "100%" : 0,
          marginBottom: amountOfContractions > i ? 40 : 0,
          alignItems: "center",
          justifyContent: "center",
        },
        seconds: new Date(startOfContractions[i] - endOfContractions[i-1]).getSeconds(),
        minutes: new Date(startOfContractions[i] - endOfContractions[i-1]).getMinutes(),
        hours:   Math.floor(new Date(startOfContractions[i] - endOfContractions[i-1])/3600000),
      })}
    return intervalHolder;
  }   

  //Map an array of interval variables to a component and store it inside a hook.
  const createViewsStoringIntervalTextAndPutItIntoAHook = () => {
    setAllIntervalText(createArrayOfVariablesUsedInIntervalTextForEveryContraction().map(intervalInfo => (
      <View key={intervalInfo.id} style={intervalInfo.style}> 
        <Text textAlign="center" style={timeText}>
          {
          (intervalInfo.hours.toString() == "0" ? "" : intervalInfo.hours+":")+
          (intervalInfo.minutes.toString().length != 2 ? "0"+intervalInfo.minutes : intervalInfo.minutes)+":"+
          (intervalInfo.seconds.toString().length != 2 ? "0"+intervalInfo.seconds : intervalInfo.seconds)
          }
        </Text>
      </View>
    )))
  }   

  //Create variables for length component for every contraction.
  const createArrayOfVariablesUsedInLengthTextForEveryContraction = () => {
    var lengthHolder = [];
    for (var i = 0; i < amountOfContractions; i++) {
      lengthHolder.push({
        id: 1000+i,
        style: {
          height: 35,
          width: "100%",
          marginBottom: 55,
          alignItems: "center",
          justifyContent: "center",     
          bottom:12,
        },
        //If contraction is active and the number of contractions is the same as this objects index then use current time instead of newest endOfContraction, so the current length of contraction can be shown.
        seconds: amountOfContractions != i+1 || !isContractionActive ? new Date(endOfContractions[i] - startOfContractions[i]).getSeconds() : (new Date((Date.now())-startOfContractions[i])).getSeconds(),
        minutes: amountOfContractions != i+1 || !isContractionActive ? new Date(endOfContractions[i] - startOfContractions[i]).getMinutes() : (new Date((Date.now())-startOfContractions[i])).getMinutes(),
        hours:   amountOfContractions != i+1 || !isContractionActive ? Math.floor(new Date(endOfContractions[i] - startOfContractions[i])/3600000) : Math.floor((new Date((Date.now())-startOfContractions[i]))/3600000),
    })}
    return lengthHolder;
  }
  
  //Map an array of length variables to a component and store it inside a hook.
  const createViewsStoringLengthTextAndPutItIntoAHook = () => {
    setAllLengthText(createArrayOfVariablesUsedInLengthTextForEveryContraction().map(lengthInfo => (
      <View key={lengthInfo.id} style={lengthInfo.style}>
        <Text style={timeText}>{
          (lengthInfo.hours.toString() == "0" ? "" : lengthInfo.hours+":")+
          (lengthInfo.minutes.toString().length != 2 ? "0"+lengthInfo.minutes : lengthInfo.minutes)+":"+
          (lengthInfo.seconds.toString().length != 2 ? "0"+lengthInfo.seconds : lengthInfo.seconds)}
        </Text>
      </View>
    )))
  }   

  const saveContractionDataToJson = async () => {
    await SecureStore.setItemAsync("amountOfContractions",JSON.stringify(amountOfContractions))
    await SecureStore.setItemAsync("isContractionActive",JSON.stringify(isContractionActive))
    await SecureStore.setItemAsync("startOfContractions",JSON.stringify(startOfContractions))
    await SecureStore.setItemAsync("endOfContractions",JSON.stringify(endOfContractions))
  }
  
  const startNewContraction = () => {
    setStartOfContractions( arr => [...arr, Date.now()])
    setIsContractionActive(true)
    setAmountOfContractions(amountOfContractions+1)
  }

  const stopContraction = () => {
    setEndOfContractions( arr => [...arr, Date.now()])
    setIsContractionActive(false)
    doInterperet(!interperet)
  }
  
  const switchContractions = () => {
    doRefreshLengthBubblesIntervals(!refreshLengthBubblesIntervals);
    if(isContractionActive){
      stopContraction();
    }
    else{
      startNewContraction();
    }
  }

  const crampButton = {backgroundColor:"#c8b0a0", alignSelf:"center",marginTop:isContractionActive ? 8 : 0, height:60, width:200, shadowColor: "#000" ,shadowOffset: {	width: 2,	height: 2,}, shadowOpacity: 0.9, shadowRadius: 10, elevation: isContractionActive ? 1 : 6,}

  return (
    <LinearGradient
    colors={["#fff","#ffe7dd"]}
    style={{flex:1}}
    >
      <SafeAreaView style={safeAreaStyle}>
        <StatusBar style="auto"/>
        <ContractionInterpretationModal index={interpretationModalIndex} setIndex={setInterpretationModalIndex}/>
        <AgreementModal navigation={navigation}/>
        
        <View style ={aboveHeaderNote}>
          <Text style={noteText}>Pamiętaj o oddechu! Oddychaj podczas skurczu i nie zatrzymuj powietrza. Staraj się, aby wydech był dłuższy niż wdech.</Text>
        </View>

        <View style={header}>
          <View style={lengthHeader}><Text style={headerTexts}>{"Trwanie"}</Text></View>
          <View style={crampsHeader}><Text style={headerTexts}>{"Skurcz"}</Text></View>
          <View style={intervalHeader}><Text style={headerTexts}>{"Przerwa"}</Text></View>
        </View>

        <ScrollView>
          <View style={middle}>
            <View style={length}>{allLengthText}</View>
            <View style={cramps}>{allContractionBubbles}</View>
            <View style={interval}>{allIntervalText}</View>   
          </View>
        </ScrollView>

        <View style={bottom} >
          <Button onPress={()=>{switchContractions()}} style={crampButton}>
            <Text style={{fontSize:16, fontFamily:"Monsterrat"}}>{isContractionActive ? "Skurcz się zakończył" : "Skurcz się rozpoczął"}</Text>
          </Button>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}


const safeAreaStyle = {flex:1};
const aboveHeaderNote = {width:"100%", height:"11%"}
  const noteText = {fontFamily:"Monsterrat",fontSize:16, color:"#353331", textAlign:"center",textShadowColor: 'rgba(200, 176, 160, 0.7)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5}
const header = {width:"75%",height:"5%", alignSelf:"center", flexDirection:"row"}
  const lengthHeader = {flex:3, alignItems:"center",flexDirection:"column-reverse"}
  const crampsHeader = {flex:5, alignItems:"center",flexDirection:"column-reverse"}
  const intervalHeader = {flex:3,alignItems:"center",flexDirection:"column-reverse"}
  const headerTexts = {fontFamily:"Monsterrat",fontSize:18, color:"#353331",textShadowColor: 'rgba(200, 176, 160, 0.7)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5}
const middle = {width:"75%",height:"100%", flexDirection:"row", alignSelf:"center"}
    const length = { flex:3, flexDirection:"column-reverse", alignContent:"flex-end"}
      const timeText = {fontFamily:"Monsterrat",fontSize:20, color:"#353331", textShadowColor: 'rgba(200, 176, 160, 0.7)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5}
    const cramps = {flex:5, alignItems:"center", flexDirection:"column-reverse", alignContent:"flex-end"}
      const circleIndexText = {fontFamily:"Monsterrat", color:"#fff", fontSize:25}
      const dateText = {fontFamily:"Monsterrat", color:"#353331", fontSize:16, bottom:8}
    const interval = {flex:3,flexDirection:"column-reverse", alignContent:"flex-end",}
const bottom = {backgroundColor:"#d7b9af", width:"100%",height:"20%", justifyContent:"center"}
