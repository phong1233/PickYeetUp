import React, { useState, useEffect } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Schedule from './schedule/Schedule';
import './Overlay.css';

const Overlay = (props) => {
    const [ hasOrder, setHasOrder] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ orderid, setOrderid] = useState("");
    const [ emailError, setEmailError ] = useState(false);
    const [ orderidError, setorderidError ] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handleOrderidChange = (e) => {
        setOrderid(e.target.value);
    }

    const deleteOrder = () => {
        localStorage.clear();
        setHasOrder(false);
    }

    const validateInformation = async () => {
        try {
            let res = await fetch(`https://sapstore.conuhacks.io/orders/byEmail?email=${email}`);
            res = await res.json();
            setEmailError(false);
        }
        catch {
            setEmailError(true);
            return;
        }

        try {
            let res = await fetch(`https://sapstore.conuhacks.io/orders/${orderid}`);
            res = await res.json();
            if (res.customerEmailAddress !== email) {
                setorderidError(true);
                return;
            }
            console.log(res)
            localStorage.setItem("order", JSON.stringify(res));
            setorderidError(false);
            setHasOrder(true);
        }
        catch {
            setorderidError(true);
            return;
        }
    }

    useEffect(() => {
        let order = localStorage.getItem("order");
        setHasOrder(order);
    })


    return (
        <div className='container'>
        {
            hasOrder ? <Schedule deleteOrder={deleteOrder} />:
            <Card className='overlay'>
                <LocalShippingIcon fontSize='large' />
                <TextField
                    required
                    id="email-field"
                    label="Email"
                    defaultValue=""
                    variant="outlined"
                    fullWidth
                    onChange={handleEmailChange}
                    error={emailError}
                />
                <TextField
                    required
                    id="orderid-field"
                    label="Order id"
                    defaultValue=""
                    variant="outlined"
                    fullWidth
                    onChange={handleOrderidChange}
                    error={orderidError}
                />
                <Button variant="contained" color="primary" onClick={validateInformation}>
                    Schedule Pickup
                </Button>
            </Card>
        }
        </div>
    )
}

export default Overlay