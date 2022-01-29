import React, { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import Map from './Map';
import { useCustomer } from '../contexts/CustomerContext';

export const MapDisplay = () => {

  const customer = useCustomer();

    const initGeocoder = async ({ maps }) => {
        const geocoder = new maps.Geocoder();
        setGeoc(geocoder);
        await getStores(geocoder);
      };
    
      const [geoc, setGeoc] = useState();
      const [stores, setStores] = useState([]);
      const [customerState, setCustomerState] = useState();

      const loadCustomer = async() => {
        if (customer.customer){
          let saved = await get(customer.customer.customerEmailAddress);
            if(saved === undefined){
              const geo = await geoc.geocode({address: customer.customer.customerAddress})
              const lat = geo.results[0].geometry.location.lat()
              const lng = geo.results[0].geometry.location.lng()
              saved = {lat: lat, lng: lng}
              await set(customer.customer.customerEmailAddress, saved)
            } 
            setCustomerState({...customer.customer, location: saved})
        }else{
          setCustomerState(undefined)
        }
      }

      useEffect(() => {
        loadCustomer();
      }, [customer]);

      const getStores = async (geocoder) => {
        const request = await fetch(`https://sapstore.conuhacks.io/stores`, {
          method: 'GET'
        });
        const response = (await request.json())
  
        if (geocoder !== undefined){
          for (let index = 0; index < response.length; index++) {
            const s = response[index];
            let saved = await get(s.storeId);
            if(saved === undefined){
              const geo = await geocoder.geocode({address: s.address})
              const lat = geo.results[0].geometry.location.lat()
              const lng = geo.results[0].geometry.location.lng()
              saved = {lat: lat, lng: lng}
              await set(s.storeId, saved)
            } 
            s['location'] = saved
          }
        }
  
        setStores(response)
      }
      
    return (
            <Map initGeocoder={initGeocoder} storesLocation={stores} customer={customerState}/>
          );
}

export default MapDisplay;