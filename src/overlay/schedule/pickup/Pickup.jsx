import React, { useState, useRef, useEffect } from 'react';
import {Card, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import './Pickup.css'
import {getDisponibilities, saveSchedule} from '../../../api/handleOrder'
import { useCustomer } from '../../../contexts/CustomerContext';


const Pickup = (props) => {
    const [currentPos, setCurrentPos] = useState(0);
    const [validPos, setValidPos] = useState(false);
    const [currentSelection, setCurrentSelection] = useState("");
    const [dispo, setDispo] = useState([]);
    const canvasRef = useRef(null);
    const [stores, setStores] = useState([])
    const [sel, setSel] = useState("")
    const customer = useCustomer();

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

    const orderStores = () => {
        const currentStores = customer.stores;
        const user = customer.customer
        let s = []
        currentStores.map((c) => s.push({...c, distance: getDistanceFromLatLonInKm(c.location.lat, c.location.lng, user.location.lat, user.location.lng)}))

        s.sort((a, b) => a.distance <= b.distance ? -1: 1)

        setStores(s)
        selectS(s[0].storeId, s[0])
    }

    const clearRectangle = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCalendar(dispo);
    }

    const drawCurrentSelection = (newPosition) => {
        const scale = 2.8
        clearRectangle();
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const width = context.canvas.width
        let start = newPosition
        let end = (newPosition + props.prepTime/5)
        let valid = true;
        for(let i=start; i < end; i++) {
            if(!dispo[i]) {
                valid = false;
                break;
            }
        }

        context.font = "10px Arial";
        let currentTime = indexToTime(newPosition);
        let endTime = indexToTime(newPosition + props.prepTime/5)
        let currentToEnd = `${currentTime} to ${endTime}`
        context.fillText(currentToEnd, width/2 - 30, end*scale - 5 )

        context.fillStyle = valid ? 'rgba(51, 255, 189, 0.4)' : 'rgba(255, 87, 51, 0.4)'
        context.fillRect(0, start*scale, width, end*scale - start*scale -1)
        context.fillStyle = '#000000'
        setValidPos(valid);
        setCurrentPos(newPosition);
        setCurrentSelection(currentToEnd);
    }

    const indexToTime = (idx) => {
        let minutes = idx * 5 + 55;
        let hours = Math.floor(minutes/60);
        minutes = minutes - hours * 60
        let hoursStr = `${hours + 8}`
        let minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`
        return `${hoursStr}:${minutesStr}`

    }

    const drawCalendar = (calendar) => {
        const scale = 2.8
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.canvas.height = scale * calendar.length;
        const width = context.canvas.width
        
        let unavailable = null;

        for(let i = -1; i <= calendar.length; i++) {
            let realIdx = i + 1;
            if((unavailable !== null && i == calendar.length) || (unavailable !== null && calendar[realIdx] == '1') ) {
                context.font = "10px Arial";
                context.fillText("Not available", width-65, realIdx*scale - 5 )

                context.fillStyle = 'rgba(0,0,0,0.2)'
                context.fillRect(0, unavailable*scale, width, realIdx*scale - unavailable*scale)
                unavailable = null;
                context.fillStyle = '#000000'
            }
            else if( unavailable === null && calendar[realIdx] == '0') {
                unavailable = realIdx
            }

            let currentTime = indexToTime(realIdx)
            let last2 = currentTime.slice(-2);

            if( last2 === "30" ) {
                context.beginPath();
                context.moveTo(0, realIdx*scale);
                context.lineTo(width, realIdx*scale);
                context.lineWidth = 0.2;
                context.stroke();
            }
            else if( last2 === "00" ) {
                context.font = "10px Arial";
                context.fillText(currentTime, 5, realIdx*scale - 5 )
                context.beginPath();
                context.moveTo(0, realIdx*scale);
                context.lineTo(width, realIdx*scale);
                context.lineWidth = 1;
                context.stroke();
            }
        }

    }

    useEffect(() => {
        orderStores();
      }, [])

    useEffect(() => {
        drawCalendar(dispo);
        drawCurrentSelection(currentPos);

    }, [dispo])
    
    const handleNavigation = (e) => {
        if (e.deltaY < 0 && currentPos > 0) {
            drawCurrentSelection(currentPos - 1);
        } else if (e.deltaY > 0 && (currentPos + props.prepTime/5) < 146) {
            drawCurrentSelection(currentPos + 1);
        }
    };

    const handleClick = (e) => {
        let pos = canvasRef.current.getBoundingClientRect();
        let canvasPos = Math.ceil((e.clientY - pos.top)/5);
        if( canvasPos >= 0 && (canvasPos + props.prepTime/5) <= 146) {
            drawCurrentSelection(canvasPos);
        }
    }

    const valFromString = (str) => {
        const hour = str.slice(0, 2)
        const minute =str.slice(2)
        return {hour, minute}

    }
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const selectS = async (val, store) => {
        setSel(val);
        const opening = JSON.parse(store.openingHours)
        const choseDayInStr = days[(props.date.getDay())]
        let currentOpening = opening.filter(k => {
            for ( const [key, value] of Object.entries(k) ) {
                if(key === choseDayInStr) return true;
            }
            return false;
        })[0]
        const start = currentOpening[choseDayInStr]["Start"]
        const end = currentOpening[choseDayInStr]["Finish"]
        const di = await getDisponibilities(store.storeId, `${props.date.getYear()}-${props.date.getMonth()}-${props.date.getDay()}`, valFromString(start), valFromString(end), store.employees, store.pickupLocations, customer.customer.parcelSize)
        setDispo(di);
    }

    const confirmTime = () => {
        const start = currentPos;
        const end = (start + props.prepTime/5) + 2
        const s = stores.filter(s => s.storeId == sel)[0]
        console.log(`${props.date.getYear()}-${props.date.getMonth()}-${props.date.getDay()}`)
        const send = saveSchedule(s.storeId, `${props.date.getYear()}-${props.date.getMonth()}-${props.date.getDay()}`, customer.customer.orderId, start, end, s.employees, s.pickupLocations, customer.customer.parcelSize)
        props.pickingFalse();
    }

    return (
        <Card className='pickupOverlay'>
            <br></br>
            <FormControl>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    value={sel}
                    onChange={(e)=> selectS(e.target.value, stores.filter(s => s.storeId === e.target.value)[0])}
                >{
                    stores.length !== 0 && (stores.map(s => {
return(<MenuItem key={s.storeId} value={s.storeId}>{`${s.name} --- ${s.distance.toFixed(2)}km`}</MenuItem>)
                    }))
                    
                }
                </Select>
            </FormControl>
            <canvas className='scheduleCanvas' onClick={(e) => handleClick(e)} onWheel={(e) => handleNavigation(e)} ref={canvasRef}/>
            <Typography>{`Current selection: ${currentSelection}`}</Typography>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Button variant="contained" color="secondary" onClick={props.pickingFalse}>Cancel</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary" onClick={confirmTime} disabled={!validPos}>Choose</Button>
                </Grid>
            </Grid>
        </Card>
    );
}

export default Pickup;