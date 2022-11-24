import { View, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

/*
    Header with an icon that goes to the cramp screen.
*/

export default function PushToCrampsHeader({navigation}){

    const goBack = () => {
        navigation.push("Cramp")
    }

    return (
        <View style={header}>   
        <TouchableOpacity style={touch} onPress={()=>{goBack()}}>
            <AntDesign style={goBackIcon} name="stepbackward" size={24} color="white" />
        </TouchableOpacity>
            <Image style = {icon} source = {require("../assets/newLogo3.png")} />
        </View>
    )
}

const icon = {aspectRatio:4, height: 50};
const touch = {position: "absolute", alignSelf:"flex-start",justifyContent:"center", left:20, height:35, width:35}
const goBackIcon = {alignSelf:"center"}
const header = {backgroundColor: "#d7b9af",alignItems: "center", justifyContent:"center", width:"100%", height: 70};