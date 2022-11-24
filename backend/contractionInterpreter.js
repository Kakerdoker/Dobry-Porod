import * as SecureStore from 'expo-secure-store';

/*
    Contraction interpreter takes all of the timestamps of when contractions began and stopped.
    Then it gets rid of all of the contractions shorter than 10 seconds to make sure no accidental clicks are counted.
    Then it only takes the 5 latest contractions.
    Then using a simple algorithm it checks what information the user should have sent to them.
    Then it makes sure the information is either new or 20 minutes have passed since it was last shown to them, to make sure that the user won't have the same message spammed to them on every contraction.
*/

var intervalsInSeconds = [];
var lengthsInSeconds = [];
var newestFiveStarts = [];
var newestFiveEnds = [];

const allLengthsLongerThanNSeconds = (n) =>{
    for(var i = 0; i < 5; i++){
        if(lengthsInSeconds[i] < n){return false}
    }
    return true
}

const allIntervalsInBetweenNAndM = (n,m) =>{
    for(var i = 0; i < 5; i++){
        if(intervalsInSeconds[i] > n || intervalsInSeconds[i] < m){return false}
    }
    return true
}

const allIntervalsShorterThanNSeconds = (n) =>{
    for(var i = 0; i < 5; i++){
        if(intervalsInSeconds[i] > n){return false}
    }
    return true
}

const getFiveLatestContractionsLongerThan10Seconds = (contractionsStart, contractionsEnd) =>{
    //newestContraction <= 10 seconds ? return true
    if((contractionsEnd[contractionsStart.length-1]-contractionsStart[contractionsStart.length-1])/1000 <= 10)return true

    var contractionLongerThan10SecStart = [];
    var contractionLongerThan10SecEnd = [];
    for(var i = 0; i < contractionsStart.length; i++){
        if((contractionsEnd[i]-contractionsStart[i])/1000 > 10){
            contractionLongerThan10SecStart.push(contractionsStart[i])
            contractionLongerThan10SecEnd.push(contractionsEnd[i])
        }
    }
    newestFiveStarts = contractionLongerThan10SecStart.slice(-5);
    newestFiveEnds = contractionLongerThan10SecEnd.slice(-5)
}

const convertContractionsToSeconds = () => {
    intervalsInSeconds = [];
    lengthsInSeconds = [];
    for(var i = 0; i < newestFiveStarts.length; i++){
        lengthsInSeconds.push(new Date(newestFiveEnds[i] - newestFiveStarts[i])/1000)
        intervalsInSeconds.push(new Date(newestFiveStarts[i] - newestFiveEnds[i-1])/1000)
    }
    intervalsInSeconds.splice(0, 1);
}

const goThroughtFiveContractionsAndReturnAppropriateMessage = () => {
    if(allLengthsLongerThanNSeconds(50)){
        if(allIntervalsShorterThanNSeconds(6*60)){
            if(allIntervalsShorterThanNSeconds(5*60)){
                if(allIntervalsShorterThanNSeconds(4*60)){
                    return 5//"wszystko wskazuje na to ze..."
                }
                return 4//"szykuj sie do wyjazdu..."
            }
            return 3//"to dobry moment aby..."
        }
        return 2//"skurcze sie rozkrecaja pamietaj..."    
    }
    if(allLengthsLongerThanNSeconds(30)){
        if(allIntervalsShorterThanNSeconds(8*60)){
            return 1//"porod powoli sie rozkreca ale..."
        }
        return 0
    }
    return 0
}

const makeSureMessageIsDifferentThanPreviousOneOr20MinsHavePassed = async (messageNum) => {
    var lastNotIgnoredMessageNum = parseInt(await SecureStore.getItemAsync("lastNotIgnoredMessageNum"));
    var timeOfLastNotIgnoredMessage = parseInt(await SecureStore.getItemAsync("timeOfLastNotIgnoredMessage"));

    if(timeOfLastNotIgnoredMessage == null){
        await SecureStore.setItemAsync("timeOfLastNotIgnoredMessage", "0");
        timeOfLastNotIgnoredMessage = 0;
    }
    if(lastNotIgnoredMessageNum == null){
        await SecureStore.setItemAsync("lastNotIgnoredMessageNum", "0");
        lastNotIgnoredMessageNum = 0;
    }

    if(lastNotIgnoredMessageNum != messageNum || Date.now() - timeOfLastNotIgnoredMessage > 1000*60*20){
        await SecureStore.setItemAsync("timeOfLastNotIgnoredMessage", Date.now().toString());
        await SecureStore.setItemAsync("lastNotIgnoredMessageNum", messageNum.toString());
        return messageNum;
    }
    return 0;
}

async function interperetContractions(contractionsStart, contractionsEnd){
    if(getFiveLatestContractionsLongerThan10Seconds(contractionsStart, contractionsEnd))return 0;
    if(newestFiveStarts.length != 5){return 0}
    convertContractionsToSeconds()

    return await makeSureMessageIsDifferentThanPreviousOneOr20MinsHavePassed(goThroughtFiveContractionsAndReturnAppropriateMessage())
}

module.exports = { interperetContractions };