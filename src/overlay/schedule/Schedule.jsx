import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, List, ListItem,ListItemIcon, ListItemText } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Schedule.css';
import { Button, TextField } from '@material-ui/core';
import Pickup from './pickup/Pickup';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {getSchedule} from "../../api/handleOrder"
import {useCustomer} from '../../contexts/CustomerContext'

const Schedule = (props) => {
    const [ order, setOrder ] = useState();
    const [ pickingDate, setPickingDate ] = useState();
    const [ data, setDate ] = useState(new Date().toISOString().split('T')[0]);
    const [ dateError, setDateError ] = useState("");
    const [ schedule, setSchedule ] = useState();
    const [ hasSchedule, setHasSchedule ] = useState(false);

    const customer = useCustomer();

    const handleDateChange = (e) => {
        let newDate = e.target.value.split("-")
        let chosenDate = new Date(newDate[0], parseInt(newDate[1])-1, newDate[2])
        let today = new Date();
        today.setHours(0,0,0,0)
        let end = new Date();
        end.setDate(end.getDate() + 14);

        if(chosenDate < today || chosenDate > end) {
            setDateError(`Must be between today and ${end.toISOString().split('T')[0]}`)
            return
        }
        setDateError("")
        setDate(e.target.value);
    }

    const setPickingToFalse = () => {
        setPickingDate(false);
    }

    const formatNumer = (str) => {
        let cleaned = ('' + str).replace(/\D/g, '');
        
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    }

    const findSchedule = async(orderId) => {
        if(!customer.stores)
        {return;}
        const data = await getSchedule(customer.stores, orderId);
        setSchedule(data)
        console.log(data)
        if(data!= undefined)
            setHasSchedule(true)
    }

    useEffect(() => {
        let storedOrder = localStorage.getItem("order");
        let o = JSON.parse(storedOrder)
        setOrder(o);
    }, [])

    useEffect(() => {
        findSchedule(order?.orderId)
    }, [customer, order])

    return (
        <>
            { pickingDate ? <Pickup prepTime={order.preparationTime} pickingFalse={setPickingToFalse} date={new Date(data)} /> :
                <>
                    <Card className='scheduleOverlay'>
                        {order &&
                        <div className='summaryBox'>
                            <Card style={{backgroundColor: "#e8e5dc"}} className='orderSummary' raised={false} elevation={0}>
                                <Grid container spacing={1}>
                                    <Grid className={'summaryText'} item xs={12}>
                                        <Typography variant="h6">
                                            Order Summary
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={2}>
                                        <Typography variant="body1">
                                            Name:
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={10}>
                                        <Typography variant="body2">
                                            {order.customerName}
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={2}>
                                        <Typography variant="body1">
                                            Number:
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={10}>
                                        <Typography variant="body2">
                                            {formatNumer(order.customerPhoneNumber)}
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={2}>
                                        <Typography variant="body1">
                                            Address:
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={10}>
                                        <Typography variant="body2">
                                            {order.customerAddress}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <List dense>
                                        {
                                            order.orderEntries.map((e) => (
                                                <ListItem key={e.productName}>
                                                    <ListItemIcon>
                                                        <ShoppingCartIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={e.productName}
                                                        secondary={`Quantity: ${e.quantity}`}
                                                    /> 
                                                    <ListItemText
                                                        style={{textAlign: "right", verticalAlign: "top", marginLeft: "auto", paddingLeft: "15px"}}
                                                        primary={`$${e.totalEntryPrice}`}

                                                    /> 
                                                </ListItem>
                                            ))
                                        }
                                        </List>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={2}>
                                        <Typography variant="body1">
                                            <b>Total:</b>
                                        </Typography>
                                    </Grid>
                                    <Grid className={'summaryText'} item xs={10}>
                                        <Typography variant="body2"  style={{marginLeft: "auto"}}>
                                            <b>${order.orderEntries.map(e => e.totalEntryPrice).reduce((prev, next) => prev+next)}</b>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Card>
                            <Typography variant="h6" style={{paddingTop: "25px"}}>
                                {hasSchedule ? `Your current schedule is from ${schedule.start.hours}:${schedule.start.minutes} to ${schedule.end.hours}:${schedule.end.minutes} at ${schedule.storeId.name}. Your parking is #${schedule.parking}. Would you like to reschedule?` : "Choose the date at which you would like to pickup your order"}
                            </Typography>
                            <br/>
                            <br/>
                            <TextField
                                id="date"
                                variant="outlined"
                                type="date"
                                error={dateError ? true : false}
                                helperText={dateError}
                                defaultValue={data}
                                onChange={handleDateChange}
                                sx={{ width: 220 }}
                                    InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <br/>
                            <br/>
                            <Button color="primary" variant="contained" onClick={() => setPickingDate(!pickingDate)}>Choose Pickup Time</Button>
                        </div>}
                    </Card>
                    
                    <Button className="backButton" startIcon={<ArrowBackIosIcon />} onClick={props.deleteOrder}>
                        Schedule another pickup
                    </Button>
                </>
            }
        </>
    );
}

export default Schedule