import { useState, useLayoutEffect } from "react";
import { Modal, View, ScrollView } from 'react-native';
import { Button, Text } from 'galio-framework';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

/*
  AgreementModal pops up the first time the user navigates to the cramp screen.
  It allows the user to accept or decline the agreement.
  The user can't click agree until they scroll to the very bottom.
*/

export default function AgreementModal({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptUnlocked, setAcceptUnlocked] = useState(false);
  var declined = false;

  //Initialize modalVisible value depending if it was already accepted or not.
  useLayoutEffect(() => {
    const checkModal = async () => {
      if(await SecureStore.getItemAsync("popupAccepted") == "true"){
        setModalVisible(false)
      }
      else {setModalVisible(true)}
    }
    checkModal();
  }, []);

  const acceptModalPopup = async () => {
    if(!declined && acceptUnlocked){
        await SecureStore.setItemAsync("popupAccepted", "true");
        setModalVisible(false);
    }
  }

  const declineModalPopup = () => {
    declined = true;
    navigation.pop();
  }
  
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >=contentSize.height - 5;
  };
  
  const footerAcceptButtonText = {fontFamily:"Monsterrat", fontSize:16, color: acceptUnlocked ? "#fff" : "#f1f1f1"}
  return(
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
    >
      <View style={modalCenter}>
        
        <LinearGradient
          colors={["#fff","#ffe7dd"]}
          style={{borderRadius:10, height:"85%"}}
        >
          <View style={modalView}>

            <View style={modalHeader}>
              <Text style={modalHeaderText}>Ważne!</Text>
            </View>

            <ScrollView
            //If ScrollView hits the bottom allow the user to click accept.
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                setAcceptUnlocked(true)
              }
            }}
            scrollEventThrottle={1000}
            >

              <View style={modalMiddle}>
                <Text style={modalMiddleText}>
                  Ta aplikacja nie stanowi porady medycznej! Aplikacja jest dedykowana kobietom przed pierwszym porodem.  Nasze zalecenia opierają się na standardowych wskaźnikach, ale twój poród może przebiegać inaczej. Aplikacja ma charakter poglądowy - w razie wątpliwości skontaktuj się z lekarzem lub położną. Dobry poród nie ponosi odpowiedzialności za działania i decyzje podjęte na podstawie informacji zawartych w aplikacji. Zanim zaczniesz korzystać z aplikacji do skurczy - przeczytaj zakładkę informacje - znajdziesz tam instrukcję jak korzystać z aplikacji. Dobrego porodu!
                </Text>
              </View>

            </ScrollView>

            <View style={modalFooter}>
              <Button onPress={acceptModalPopup} color={acceptUnlocked ? "#c8b0a0" : "#c8c8c8"}>
                <Text style={footerAcceptButtonText}>AKCEPTUJĘ</Text>
              </Button>

              <Button onPress={declineModalPopup} color="#c8b0a0">
                <Text style={footerDeclineButtonText}>NIE AKCEPTUJĘ</Text>
              </Button>
            </View>

          </View>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const modalCenter = {flex: 1, justifyContent: "center", alignItems: "center"};
const modalView = { width: "85%",height:"100%", borderRadius: 10, padding: 20, alignItems: "center", borderWidth:5, borderColor:"#ae907d"};
  const modalHeader = {width:"100%", alignItems:"center",};
    const modalHeaderText = {fontFamily:"SignikaNegative", fontSize:30, textAlign:"center", color:"#353331"}
  const modalMiddle = {width:"100%", paddingTop:20};
    const modalMiddleText = {fontFamily:"Monsterrat", fontSize:19, textAlign:"center", color:"#353331"}
  const modalFooter = {width:"100%", paddingTop:20, alignItems:"center", justifyContent:"center"};
    const footerDeclineButtonText = {fontFamily:"Monsterrat", fontSize:16, color: "#fff"}