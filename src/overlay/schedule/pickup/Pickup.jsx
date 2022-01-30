import React, { useState, useRef, useEffect } from 'react';
import {Card, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import './Pickup.css'

const temp = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

const Pickup = (props) => {
    const [value, setValue] = useState(new Date().toISOString().split('T')[0]);
    const [currentPos, setCurrentPos] = useState(0);
    const [validPos, setValidPos] = useState(false);
    const [currentSelection, setCurrentSelection] = useState("");
    const canvasRef = useRef(null);

    const clearRectangle = () => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCalendar(temp);
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
            if(!temp[i]) {
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
            if( unavailable !== null && calendar[realIdx] === 1 ) {
                context.font = "10px Arial";
                context.fillText("Not available", width-65, realIdx*scale - 5 )

                context.fillStyle = 'rgba(0,0,0,0.2)'
                context.fillRect(0, unavailable*scale, width, realIdx*scale - unavailable*scale)
                unavailable = null;
                context.fillStyle = '#000000'
            }
            else if( unavailable === null && calendar[realIdx] === 0) {
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
        drawCalendar(temp);
        drawCurrentSelection(currentPos);
      }, [])
    
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

    return (
        <Card className='pickupOverlay'>
            <br></br>
            <FormControl>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={1}
                    inputProps={{ 'aria-label': 'Without label' }}
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value={1}>Store #1 - 50km</MenuItem>
                    <MenuItem value={2}>Store #2 - 50km</MenuItem>
                    <MenuItem value={3}>Store #3 - 50km</MenuItem>
                </Select>
            </FormControl>
            <canvas className='scheduleCanvas' onClick={(e) => handleClick(e)} onWheel={(e) => handleNavigation(e)} ref={canvasRef}/>
            <Typography>{`Current selection: ${currentSelection}`}</Typography>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Button variant="contained" color="primary">Choose</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="secondary" onClick={props.pickingFalse}>Cancel</Button>
                </Grid>
            </Grid>
        </Card>
    );
}

export default Pickup;