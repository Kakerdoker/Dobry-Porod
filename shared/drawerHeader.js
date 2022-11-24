import { View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

/*
    Header with an icon that opens the drawer.
*/

export default function DrawerHeader({navigation}){

    const openDrawer = () => {
        navigation.openDrawer();
    }

    return (
        <View style={header}>   
            <Feather style={drawerIcon} name="menu" size={24} color="white" onPress={()=>{openDrawer()}}/>
            <Image style = {icon} source = {require("../assets/newLogo3.png")} />
        </View>
    )
}

const icon = {aspectRatio:4, height: 50};
const drawerIcon = {position: "absolute", alignSelf:"flex-start", left:20};
const header = {backgroundColor: "#d7b9af",flexDirection: "column", alignItems: "center", justifyContent:"center", width:"100%", height: 70};