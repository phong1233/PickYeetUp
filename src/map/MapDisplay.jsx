import React, { useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import Map from './Map';

export const MapDisplay = () => {

    const initGeocoder = ({ maps }) => {
        const geocoder = new maps.Geocoder();
        setGeocoder(geocoder);
      };
    
      const [stores, setStores] = useState([]);
      const [geocoder, setGeocoder] = useState([]);
    
      useEffect(() => {
        const getStores = async () => {
          const request = await fetch(`https://sapstore.conuhacks.io/stores`, {
            method: 'GET'
          });
          const response = (await request.json())
    
          if (geocoder !== undefined){
            for (let index = 0; index < response.length; index++) {
              const s = response[index];
              let saved = await get(s.storeId);

              if(saved == undefined){
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
        getStores();
    
      }, []);

    return (
            <Map initGeocoder={initGeocoder} storesLocation={stores}/>
          );
}

export default MapDisplay;