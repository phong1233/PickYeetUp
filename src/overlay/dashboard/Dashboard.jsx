import React from 'react';
import { Button, Card, Grid, Typography } from '@material-ui/core';
import '../schedule/Schedule.css';

const Dashboard = (props) => {
    return (
        <>
        {true &&
            <div style={{paddingTop:'30px'}}>
                <Typography variant="h5">
                    Your Current Order
                </Typography>
                <Card style={{backgroundColor: "#e8e5dc"}} className='orderSummary' raised={false} elevation={0}>
                <Grid container spacing={1}>
                    <Grid className={'summaryText'} item xs={12}>
                        <Typography variant="h6">
                            Scheduled at 1h30 p.m
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={4}>
                        <Typography variant="body1">
                            Store Name:
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={8}>
                        <Typography variant="body2">
                            Store 1
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={4}>
                        <Typography variant="body1">
                            Address: 
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={8}>
                        <Typography variant="body2">
                           customer Name
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={4}>
                        <Typography variant="body1">
                            Telephone:
                        </Typography>
                    </Grid>
                    <Grid className={'summaryText'} item xs={8}>
                        <Typography variant="body2">
                           customer Telephone number
                        </Typography>
                    </Grid>
                </Grid>
                <Button style={{marginTop: "20px"}} variant="contained" color="primary">
                    <Typography variant="body2">
                        Edit your reservation
                    </Typography>
                </Button>
            </Card>
            </div>}
        </>
    )

}

export default Dashboard