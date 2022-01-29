import React from 'react';
import { Button, Card } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Schedule.css';

const Schedule = (props) => {

    return (
        <>
            <Card className='scheduleOverlay'>
                <Card className='orderSummary'>
                    Order Summary
                </Card>
            </Card>
            <Button className="backButton" startIcon={<ArrowBackIosIcon />} onClick={props.deleteOrder}>
                Schedule another pickup
            </Button>
        </>
    );
}

export default Schedule