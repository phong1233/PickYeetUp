import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Typography } from '@material-ui/core';
import Schedule from './schedule/Schedule';
import './Overlay.css';
import { useCustomer } from '../contexts/CustomerContext';
import pickmeup from '../logo/pickmeup.png';

const Overlay = (props) => {
    const [ hasOrder, setHasOrder] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ orderid, setOrderid] = useState("");
    const [ emailError, setEmailError ] = useState(false);
    const [ orderidError, setorderidError ] = useState(false);

    const customer = useCustomer();

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
        let customerInfo = undefined;
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
            localStorage.setItem("order", JSON.stringify(res));
            setorderidError(false);
            setHasOrder(true);
            customerInfo = res;
        }
        catch {
            setorderidError(true);
            return;
        }

        if(customerInfo){
            customer.setCustomer(customerInfo);
        }
        setEmail("");
        setOrderid("");
        setorderidError(false);
        setHasOrder(false);
        setEmailError(false)

    }

    useEffect(() => {
        let order = localStorage.getItem("order");
        setHasOrder(order);
    }, [])


    return (
        <div className='container'>
        {
            hasOrder ? <Schedule deleteOrder={deleteOrder} />:
            <Card className='overlay'>
                <img src={pickmeup} alt="Logo" width='150' height='150'/>
                <Typography variant='body1'>Schedule your pickup order. Satisfaction guaranteed.</Typography>
                <TextField  
                    required
                    id="email-field"
                    label="Email Address"
                    defaultValue=""
                    variant="outlined"
                    fullWidth
                    onChange={handleEmailChange}
                    error={emailError}  
                    helperText={emailError ? "Please provide a valid email address." : ""}
                />
                <TextField
                    required
                    id="orderid-field"
                    label="Order ID"
                    defaultValue=""
                    variant="outlined"
                    fullWidth
                    onChange={handleOrderidChange}
                    error={orderidError}
                    helperText={orderidError ? "Please provide a valid order ID." : ""}
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