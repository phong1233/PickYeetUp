import React from 'react';
import {Button} from '@material-ui/core';
import '../Schedule.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const Pickupbutton = (props) => {
    return (
        <Button className="backButton" startIcon={<ArrowBackIosIcon />} onClick={props.onClick}>
            Schedule another pickup
        </Button>
    ) 
} 

export default Pickupbutton;