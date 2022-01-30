import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
  };

firebase.initializeApp(firebaseConfig);


const db = firebase.firestore();

const getAllSchedules = async (storeId, date) => {
    const snapshot = await db.collection(date).doc(storeId).collection(storeId).get();
    const data =  snapshot.docs?.map(doc => doc.data());
    return data
}

const mapItoHours = (i) => {
    const hours = Math.floor((i * 5) / 60);
    const minutes = (i % 12) * 5;
}

const mapHoursToI = (hours, minutes) => {
    // knowing that 8:55 is 0
    if(hours == 8 && minutes == 55){
        return 0
    }
    const i =  Math.floor((60 * (hours - 9) + minutes) / 5) + 1;
    return i;
}

const available = (allEmployees, occupiedEmployees) => {
    return allEmployees.filter(e => !occupiedEmployees.includes(e.id))
}

function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export const getDisponibilities = async (storeId, date, storeStart, storeEnd, employees, parkings, parcelSize) => {
    const val = await getAllSchedules(storeId, date);
    // list of schedules
    const occupied = {}
    for(let i = 0;i <val.length;i++){
        const array = range(val[i].client.start, val[i].client.end);
        for(let j=0; j<array.length; j++){
            if(occupied[array[j]] == undefined){
                occupied[array[j]] = {employees: [], parkings: []}
            }
            occupied[array[j]]["employees"].push(...val[i].employees);
            occupied[array[j]]["parkings"].push(val[i].parking);
        }
    }
    const startI = mapHoursToI(parseInt(storeStart.hour), parseInt(storeStart.minute));
    const endI = mapHoursToI(parseInt(storeEnd.hour), parseInt(storeEnd.minute));
    // Create 5min table with information

    let table = []

    for(let i = 0; i< 146; i++){
        // Check that this i is in hours

        if(i < startI - 1 || i > endI + 1){
            table.push(0);
            continue;
        }

        // if i is in a schedule
        // Look to see if no other parking

        let avEmployees = available(employees, [])
        let avParkings = available(parkings, [])

        if(occupied[i] != undefined){
            avEmployees = available(employees, occupied[i].employees)
            avParkings = available(parkings, occupied[i].parkings)
        }
        let success = true;
        if(parcelSize == "L"){
            // 2 employees
            if(avParkings.filter(p => p.parcelSize == "L").length == 0 || avEmployees < 2){
                success = false;
            }
        }else if(parcelSize == "M"){
            if(avParkings.filter(p => p.parcelSize == "M" || p.parcelSize == "L").length == 0 || avEmployees == 0){
                success = false;
            }
        }else{
            if(avParkings.length == 0 || avEmployees == 0){
                console.log(occupied[i].employees)
                console.log(occupied[i].parkings)
                success = false;
            }
        }
        table.push(success ? "1": "0");
     }
     console.log(table)
}

export const saveSchedule = async (storeId, date, orderId, start, end, employees, parkings, parcelSize) => {

    const val = await getAllSchedules(storeId, date);
    // list of schedules

    const occupied = {}
    for(let i = 0;i <val.length;i++){
        const array = range(val[i].client.start, val[i].client.end);
        for(let j=0; j<array.length; j++){
            if(occupied[array[j]] == undefined){
                occupied[array[j]] = {employees: [], parkings: []}
            }
            occupied[array[j]]["employees"].push(...val[i].employees);
            occupied[array[j]]["parkings"].push(val[i].parking);
        }
    }
    let avEmployees = available(employees, [])
    let avParkings = available(parkings, [])

    for(let i=start; i<end+1;i++ ){
        if(occupied[i] !== undefined){
            avEmployees = available(avEmployees, occupied[i]["employees"])
            avParkings = available(avParkings, occupied[i]["parkings"])
        }
    }
    let choosenEmployees = []
    let choosenParking = "";

    if(parcelSize == "L"){
        if(avEmployees.length >= 2){
            choosenEmployees.push(avEmployees[0].id);
            choosenEmployees.push(avEmployees[1].id);
        }else{
            throw new Error('Missing Employee should not be here');
        }
        const avPa = avParkings.filter(p => p.parcelSize == "L")
        if(avPa.length >= 1){
            choosenParking = avPa[0].id;
        }else{
            throw new Error('Missing parking should not be here');
        }
    }else if(parcelSize == "M"){
        if(avEmployees.length >= 1){
            choosenEmployees.push(avEmployees[0].id);
        }else{
            throw new Error('Missing Employee should not be here');
        }
        const avPa = avParkings.filter(p => p.parcelSize == "M" ||  p.parcelSize == "L")

        if(avPa.length >= 1){
            //choose smallest parking first

            for(let i=0; i< avPa.length; i++){
                if(avPa[i].parcelSize == "M"){
                    choosenParking = avPa[i].id;
                    break;
                }
            }
            // Select the first one which means it is not Large
            if(choosenParking == "")
                choosenParking = avPa[0].id;
        }else{
            throw new Error('Missing parking should not be here');
        }
    }else{
        if(avEmployees.length >= 1){
            choosenEmployees.push(avEmployees[0].id);
        }else{
            throw new Error('Missing Employee should not be here');
        }

        if(avParkings.length >= 1){
            //choose smallest parking first

            for(let i=0; i< avParkings.length; i++){
                if(avParkings[i].parcelSize == "S"){
                    choosenParking = avParkings[i].id;
                    break;
                }
            }
            for(let i=0; i< avParkings.length; i++){
                if(avParkings[i].parcelSize == "M"){
                    choosenParking = avParkings[i].id;
                    break;
                }
            }
            // Select the first one which means it is Large
            if(choosenParking == "")
                choosenParking = avParkings[0].id;
        }else{
            throw new Error('Missing parking should not be here');
        }
    }

    if(choosenParking == "" || choosenEmployees.length == 0){
        throw new Error('Missing employee or parking should not be here');
    }

    console.log(choosenEmployees)
    console.log(choosenParking)

    return await db.collection(date).doc(storeId).collection(storeId).doc(orderId).set({
        client: {start: start, end: end}, 
        parking: choosenParking,
        employees: choosenEmployees})
}


export {  db };