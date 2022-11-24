import { SafeAreaView, StatusBar, Alert, Text, View, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Button } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

/*
  CrampInfo holds important information about cramps for the user.
  It also contains a delete button that deletes all contraction data.
*/

export default function CrampInfo() {

  const deleteContractions = async () => {
    await SecureStore.setItemAsync("amountOfContractions",JSON.stringify(0))
    await SecureStore.setItemAsync("isContractionActive",JSON.stringify(false))
    await SecureStore.setItemAsync("startOfContractions",JSON.stringify([]))
    await SecureStore.setItemAsync("endOfContractions",JSON.stringify([]))
  }

  const deleteAlert = () => {
    Alert.alert(
      "Czy na pewno chcesz usunąć skurcze?",
      "Klikając Tak usuniesz wszystkie skurcze bez możliwości przywrócenia danych.",
      [
        {
          text:"NIE",
          onPress: () => {return}
        },
        {
          text:"TAK",
          onPress: () => deleteContractions()
        },
      ]
    )
  }

  return ( 
    <LinearGradient
    colors={["#fff","#ffe7dd"]}
    >
    <SafeAreaView>
        <StatusBar style="auto"/>

        <View style={top}>
          <ScrollView>
            <View style={textHolder}>
              <Text style = {h1}>Instrukcja obsługi</Text>
              <Text style = {normalText}>Aplikacja jest prosta w użyciu. Kiedy rozpocznie się skurcz naciśnij „Skurcz się rozpoczął” kiedy skurcz się zakończy wciśnij guzik „Skurcz się zakończył”. Aplikacja sama zacznie zliczać odstępy między skurczami i co jakiś czas wyśle ci powiadomienie na podstawie twoich przebytych skurczy.</Text>

              <Text style={h1}>Oddychaj</Text>
              <Text style = {normalText}>Pamiętaj, aby nie zatrzymywać powietrza w trakcie skurczu i oddychać, starając się, aby wydech był dłuższy niż wdech.</Text>

              <Text style = {normalText}>Na Islandii przyjmuje się, że odpowiedni czas na udanie się do szpitala - to wtedy kiedy odstępy między skurczami wynoszą około 4-5 minut, a skurcze trwają około 60 sekund. Charakterystyczne dla aktywnej fazy porodu jest także to, że skurcze nasilają swoją regularność i stają się coraz bardziej intensywne. W razie jakichkolwiek wątpliwości zawsze skontaktuj się telefonicznie z najbliższym oddziałem położniczym.</Text> 

              <Text style={h1}>Ważne</Text>
              <Text style = {normalText}>Jeśli odejdą ci wody płodowe (bezbarwne) koniecznie skontaktuj się telefonicznie z oddziałem porodowym, na którym zamierzasz rodzić. Położna poinformuje cię, czy w twoim przypadku masz przyjechać do szpitala, czy jeśli nie ma skurczy to wdrożone będzie postępowanie wyczekujące.</Text>
              <Text style = {normalText}>Pamiętaj, że na Islandii zanim ruszysz do szpitala - warto najpierw skontaktować się telefonicznie ze szpitalem i poinformować o tym, że zamierzasz przyjechać.</Text>

              <Text style={h1}>Sytuacje w których od razu należy jechać do szpitala</Text>
              <Text style={list}>-Jeśli odeszły wody płodowe i są w kolorze zielonkawym, brązowym.</Text>
              <Text style={list}>-Jeśli pojawiło się krwawienie silne jak na miesiączkę.</Text>
              <Text style={list}>-Jeśli jesteś nosicielką GBS.</Text> 

              <Text style={normalText}></Text>

              <Text style={h1}>Warunki pogodowe i czas dojazdu</Text>
              <Text style = {normalText}>Mieszkając na Islandii musimy wziąć zawsze pod uwagę warunki pogodowe oraz czas dojazdu. Jeśli mieszkasz daleko od szpitala - warto wyjechać z domu wcześniej. Nie polegaj tylko i wyłącznie na aplikacji, ale na tym jak się czujesz. W razie wątpliwości zawsze skontaktuj się z oddziałem położniczym.</Text>

              <Text style={h1}>Drugi i kolejny poród.</Text>
              <Text style = {normalText}>U wieloródek poród przeważnie przebiega szybciej i sprawniej. Zatem nie polegaj tylko i wyłącznie na aplikacji, ale na tym jak się czujesz i bazuj. Pamiętaj, że chociaż rodzisz kolejny raz, to każdy poród jest inny i może się potoczyć dużo szybciej.</Text> 

              <Text style = {normalText}>Ta aplikacja nie stanowi porady medycznej! Aplikacja jest dedykowana kobietom przed pierwszym porodem.  Nasze zalecenia opierają się na standardowych wskaźnikach, ale twój poród może przebiegać inaczej. Aplikacja ma charakter poglądowy - w razie wątpliwości skontaktuj się z lekarzem lub położną. Dobry poród nie ponosi odpowiedzialności za działania i decyzje podjęte na podstawie informacji zawartych w aplikacji.</Text>
            </View>
          </ScrollView>
        </View>
        
        <View style ={bottom}>
          <Button color="#ca6767" onPress={deleteAlert} >
            <Text style={deleteButtonText}>Usuń skurcze</Text>
          </Button>
        </View>

    </SafeAreaView>
    </LinearGradient>
  );
}

const top = {height:"90%"}
  const textHolder = {width:"80%", alignSelf:"center"}
    const h1 = {fontFamily:"SignikaNegative", fontSize:27, textAlign:"center", color:"#353331"}
    const normalText = {fontFamily:"Monsterrat", color:"#353331", fontSize:18, textAlign:"justify", marginBottom:16}
    const list = {fontFamily:"Monsterrat", color:"#353331", fontSize:18, paddingLeft:16, textAlign:"justify"}
const bottom = {backgroundColor:"#d7b9af", width:"100%",height:"10%", justifyContent:"center", alignItems:"center",}
  const deleteButton = {}
    const deleteButtonText = {fontFamily:"Monsterrat", fontSize:16, color:"#fff"}
