import React, { useState, useEffect, useRef } from 'react';
import { get, set } from 'idb-keyval';
import Map from './Map';
import { useCustomer } from '../contexts/CustomerContext';
import { useOther } from '../contexts/OtherContext';

export const MapDisplay = () => {

  const customer = useCustomer();
  const other = useOther();

    const initGeocoder = async ({ maps }) => {
        const geocoder = new maps.Geocoder();
        setGeoc(geocoder);
        await getStores(geocoder);
      };
    
      const [geoc, setGeoc] = useState();
      const [stores, setStores] = useState([]);
      const [customerState, setCustomerState] = useState();

      const loadCustomer = async() => {
        if (other.customer){
          let u = null
          try{
            u = JSON.parse(other.customer)

          }catch{
            u = other.customer
          }
          let saved = await get(u.customerEmailAddress);

            if(saved === undefined){
              const geo = await geoc.geocode({address: u.customerAddress})
              const lat = geo.results[0].geometry.location.lat()
              const lng = geo.results[0].geometry.location.lng()
              saved = {lat: lat, lng: lng}
              await set(u.customerEmailAddress, saved)
            } 
            localStorage.setItem("customer", JSON.stringify({...u, location: saved}));
            setCustomerState({...u, location: saved})
            customer.setCustomer({...u, location: saved})
        }else{
          setCustomerState(undefined)
        }
      }

      useEffect(() => {
        loadCustomer();

      }, [other]);

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
        customer.setStores(response)
      }
      
    return (
            <Map initGeocoder={initGeocoder} storesLocation={stores} customer={customerState}/>
          );
}

export default MapDisplay;