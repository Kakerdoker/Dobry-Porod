import { SafeAreaView, StatusBar, BackHandler, Alert, useCallback, Text, Image, View, ScrollView } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { Input, Button, Block, Switch } from 'galio-framework';
import { useRoute, useFocusEffect  } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

/*
  Placeholder screen used in the github version to avoid stealing the contents of the course.
*/

export default function Placeholder() {

  return ( 
    <LinearGradient
    colors={["#fff","#ffe7dd"]}
    >
    <SafeAreaView>
        <StatusBar style="auto"/>
        <View style={top}>
          <Text style={normalText}>Używasz aplikacji w wersji przeznaczonej na githuba - aby uzyskać dostęp do zawartości kursu skontaktuj się na DobryPorod.com</Text>
        </View>
    </SafeAreaView>
    </LinearGradient>
  );
}


const top = {height:"100%",width:"80%",alignSelf:"center", justifyContent:"center"}
  const normalText = {fontFamily:"Monsterrat", color:"#353331", fontSize:18, textAlign:"center", marginBottom:16}