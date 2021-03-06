import React, { useState, useEffect } from 'react';
import { Card, TextField, Button, Typography } from '@material-ui/core';
import Schedule from './schedule/Schedule';
import './Overlay.css';
import { useCustomer } from '../contexts/CustomerContext';
import pickyeetup from '../logo/pickyeetup.png';
import { useOther } from '../contexts/OtherContext';


const Overlay = (props) => {
    const [ hasOrder, setHasOrder] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ orderid, setOrderid] = useState("");
    const [ emailError, setEmailError ] = useState(false);
    const [ orderidError, setorderidError ] = useState(false);

    const customer = useCustomer();
    const other = useOther();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handleOrderidChange = (e) => {
        setOrderid(e.target.value);
    }

    const deleteOrder = () => {
        localStorage.clear();
        setHasOrder(false);
        customer.setCustomer(undefined);
        other.setCustomer(undefined);
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
            other.setCustomer(customerInfo);
        }
        setEmail("");
        setOrderid("");
        setorderidError(false);
        setEmailError(false);
    }

    useEffect(() => {
        let order = localStorage.getItem("order");
        let user = localStorage.getItem("customer");
        other.setCustomer(user)
        setHasOrder(order);
    }, [])


    return (
        <div className='container'>
        {
            hasOrder ? <Schedule deleteOrder={deleteOrder} />:
            <Card className='overlay'>
                <img src={pickyeetup} alt="Logo" width='250' height='250'/>
                <Typography variant='body1'>Schedule your pickup order. Satisfaction guaranteed.</Typography>
                <br/>
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