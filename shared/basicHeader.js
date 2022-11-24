import { Text, View, Image } from 'react-native';

/*
    Header with just the logo and nothing else.
*/

export default function BasicHeader(){
    return (
        <View style={header}>
            <Image style = {icon} source = {require("../assets/newLogo3.png")} />
        </View>
    )
}

const icon = {aspectRatio:4, height: 50};
const header = {backgroundColor: "#d7b9af",alignItems: "center", justifyContent:"center", width:"100%", height: 70};