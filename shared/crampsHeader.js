import { View, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

/*
    Header with 2 icons, one navigates you back to welcome screen, the other to the cramp information screen.
*/

export default function CrampsHeader({navigation}){

    const goBack = () => {
        navigation.navigate("MainDrawer")
    }
    const navigateToInformations = () => {
        navigation.navigate("CrampInfo")
    }

    return (
        <View style={header}>   
            <TouchableOpacity style={leftTouch} onPress={()=>{goBack()}}>
                <AntDesign style={smolIcon} name="stepbackward" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={rightTouch} onPress={()=>{navigateToInformations()}}>
                <Ionicons name="information-circle-outline" size={30} color="white" />
            </TouchableOpacity>

            <Image style = {icon} source = {require("../assets/newLogo3.png")} />
        </View>
    )
}

const icon = {aspectRatio:4, height: 50};
const leftTouch = {position: "absolute", alignSelf:"flex-start",justifyContent:"center", left:20, height:35, width:35}
const rightTouch = {position: "absolute", alignSelf:"flex-end",justifyContent:"center", right:20, height:35, width:35}
const smolIcon = {alignSelf:"center"}
const header = {backgroundColor: "#d7b9af",alignItems: "center", justifyContent:"center", width:"100%", height: 70};