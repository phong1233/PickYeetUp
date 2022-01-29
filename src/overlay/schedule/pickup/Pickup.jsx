import React, { useState } from 'react';
import {TextField} from '@material-ui/core';
import './Pickup.css'

const Pickup = () => {
    const [value, setValue] = useState(new Date().toISOString().split('T')[0]);
    const [minDate, setMinDate] = useState(new Date().toISOString().split('T')[0]);
    const [maxDate, setMaxDate] = useState(new Date(new Date().getTime()+(14*24*60*60*1000)).toISOString().split('T')[0]);

    const handleDateChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <div className={"pickupContainer"}>
            <TextField
                id="date"
                label="Date"
                type="date"
                variant="outlined"
                fullWidth
                defaultValue={value}
                sx={{ width: 220 }}
                InputLabelProps={{
                    min: minDate, 
                    max: maxDate, 
                    shrink: true,
                }}
            />
        </div>
    );
}

export default Pickup;