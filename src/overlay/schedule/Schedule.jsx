import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Typography, List, ListItem,ListItemIcon, ListItemText } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Schedule.css';
import Pickup from './pickup/Pickup'

const Schedule = (props) => {
    const [ order, setOrder ] = useState();

    const formatNumer = (str) => {
        let cleaned = ('' + str).replace(/\D/g, '');
        
        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };

        return null
    }

    useEffect(() => {
        let storedOrder = localStorage.getItem("order");
        setOrder(JSON.parse(storedOrder));
    }, [])

    return (
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
                            <Grid item sx={12}>
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
                                        </ListItem>
                                    ))
                                }
                                </List>
                            </Grid>
                        </Grid>
                    </Card>
                    <Pickup />
                </div>}

            </Card>
            <Button className="backButton" startIcon={<ArrowBackIosIcon />} onClick={props.deleteOrder}>
                Schedule another pickup
            </Button>
        </>
    );
}

export default Schedule