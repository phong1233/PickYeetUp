import React from 'react';
import { Button, Card} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Selection.css';
import { useCustomer } from '../../../contexts/CustomerContext';

const Selection = (props) => {
    const customer = useCustomer();

    return (
        <><Card className='selectionOverlay'>
            <h2>Select the most appropriate time</h2>
            <table>
                <tbody>
                    {customer && customer.stores && customer.stores.map(store => {
                        return(
                            <tr key={store.storeId}>
                                <td>{store.name}</td>
                                <td>distance to you: {store.name}km</td>
                                
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </Card>
            <Button className="backButton" startIcon={<ArrowBackIosIcon />} onClick={props.deleteOrder}>
                Schedule another pickup
            </Button>
        </>
    );
}

export default Selection