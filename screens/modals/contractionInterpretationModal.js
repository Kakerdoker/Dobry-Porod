import { useState, useEffect } from "react";
import { Modal, View } from 'react-native';
import { Button, Text } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

/*
  ContractionInteretationModal takes two arguments, the hook and hook value from the cramp.js screen.
  It uses the index to show the correct message in the modal, if the index is equal to 0 then the modal doesn't show up at all.
  It uses setIndex to change it to 0 after the user clicks the OK button.
*/

export default function ContractionInterpretationModal({index,setIndex}) {
  const [interpretationMessage, setInterpretationMessage] = useState("Nie powinnaś widzieć tej wiadomośći, coś poszło nie tak w aplikacji.")

  const returnStringDependingOnIndex = () => {
    if(index == 1) return "Poród powoli się rozkręca, ale może się jeszcze wyciszyć. Odpocznij, zjedz coś, oddychaj."
    if(index == 2) return "Skurcze się rozkręcają. Pamiętaj żeby oddychać w trakcie skurczy."
    if(index == 3) return "To dobry moment aby zadzwonić do szpitala i opisać skurcze."
    if(index == 4) return "Szykuj się do wyjazdu do szpitala. Spokojnie naszykuj torbę. Jeśli skurcze utrzymają regularność jedź do szpitala."
    if(index == 5) return "Wszystko wskazuje na to że jesteś w aktywnej fazie porodu! Jedź do szpitala. Trzymam kciuki za dobry poród!"
    return "Nie powinnaś widzieć tej wiadomośći, coś poszło nie tak w aplikacji."
  }

  useEffect(()=>{
    setInterpretationMessage(returnStringDependingOnIndex())
  }, [index])

  const makeModalInvisible = () => {
    setIndex(0)
  }

  return(
    <Modal
    animationType="fade"
    transparent={true}
    visible={index != 0}
    >
      <View style={modalCenter}>
        <LinearGradient
          colors={["#fff","#ffe7dd"]}
          style={{borderRadius:10}}
        >
          <View style={modalView}>
            <View style={modalHeader}><Text style={modalHeaderText}>Skurcze</Text></View>
            <View style={modalMiddle}><Text style={modalMiddleText}>{interpretationMessage}</Text></View>
            <View style={modalFooter}><Button onPress={()=>{makeModalInvisible()}} color="#c8b0a0"><Text style={footerButtonText}>OK</Text></Button></View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const modalCenter = {flex: 1, justifyContent: "center", alignItems: "center"};
const modalView = { width: "85%", borderRadius: 10, padding: 20, alignItems: "center", borderWidth:5, borderColor:"#ae907d"};
  const modalHeader = {width:"100%", alignItems:"center",};
    const modalHeaderText = {fontFamily:"SignikaNegative", fontSize:30, textAlign:"center", color:"#353331"}
  const modalMiddle = {width:"100%", paddingTop:20, paddingBottom:30};
    const modalMiddleText = {fontFamily:"Monsterrat", fontSize:18, textAlign:"center", color:"#353331"}
  const modalFooter = {width:"100%", alignItems:"center", justifyContent:"center"};
    const footerButtonText = {fontFamily:"Monsterrat", fontSize:16, color:"#fff"}