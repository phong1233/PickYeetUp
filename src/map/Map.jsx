
import GoogleMapReact from 'google-map-react';
import './Map.css';
import { Room, Home, Close } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';

const Map = ({ customer, storesLocation, initGeocoder }) => {

    const defaultLocation = {
        address: "default address",
        lat: 45.5076627,
        lng: -73.7251843
      };

    const [markerSelected, setMarkerSelected] = useState()

    const sel = (s) =>{
      setMarkerSelected(s);
    }

    return(
        <div className="Map">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.REACT_APP_MAPS_API || "",
                }}
                defaultCenter={defaultLocation}
                defaultZoom={12}
                options={{ 
                    clickableIcons: false,
                    disableDefaultUI: true, 
                    gestureHandling: "cooperative", 
                    zoomControl: false, 
                    disableDoubleClickZoom: true
                    }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={initGeocoder}
                >
                {customer && <Marker type={"home"} color={"#171cd1"} lat={customer.location.lat} lng={customer.location.lng} />}
                {storesLocation && storesLocation.map(s => {
                    return ( <Marker select={(id) => sel(id)} selected={s.storeId === markerSelected} type={"store"} color={"red"} key={s.storeId} lat={s.location.lat} lng={s.location.lng} store={s} />)
                })}
            </GoogleMapReact>
        </div>
    )
}

const Marker = ({color, type, store, selected, select}) => {
  const [show, setShow] = useState(false);

  const realClick = () => {
    select(store.storeId)
  }

  const exit = () => {
    setShow(false);
  }

  const enter = () => {
      setShow(true)
  }

    return (<><div className={"Marker"} onClick={() => realClick()} onMouseEnter={() => enter()} onMouseLeave={()=> exit()}>
        {type === "home" ? <Home className="Marker" style={{fill: color}} fontSize="large"/> : <Room className="Marker" style={{fill: selected ? 'green': color}} fontSize="large"/>}
        
        </div>
        {show && (type === "store" ? <InfoWindow store={store} /> : <InfoWindowHome />)}
        </>
    );
  };

  const InfoWindowHome = () => {
    const infoWindowStyle = {
      position: 'relative',
      bottom: 75,
      left: '-75px',
      width: 170,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 12,
      zIndex: 100,
      color:'black',
      borderRadius: "20px",
      cursor: "default"
    };


    return (
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 14 }}>
          Home sweet home!
        </div> 
      </div>
    );
  };

  const InfoWindow = ({ store, onClose }) => {
    const infoWindowStyle = {
      position: 'relative',
      bottom: 310,
      left: '-75px',
      width: 170,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 12,
      zIndex: 100,
      color:'black',
      borderRadius: "20px",
      cursor: "default"
    };

    const formatNumber = (str) => {
      let cleaned = ('' + str).replace(/\D/g, '');
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      };
      return ""
  }

  const reformatHours = (h) => {
    let s = h.Start;
    let f = h.Finish;

    s = `${s[0] == '0' ? "": s[0]}${s[1]}:${s[2]}${s[3]}`
    f = `${f[0] == '0' ? "": f[0]}${f[1]}:${f[2]}${f[3]}`
    return `${s} - ${f}`
  }

  const displayHours = (h) => {
    for (const [key, value] of Object.entries(h)) {
      return(<><td>{key}</td><td style={{paddingLeft: '25px'}}>{reformatHours(value)}</td></>)
    }
  }

  const [hours] = useState(JSON.parse(store.openingHours))

    return (
      <div style={infoWindowStyle}>
        <div style={{ fontSize: 14 }}>
          {store.name}
        </div> 
        <p>{store.address}</p>
        <p >Tel: {formatNumber(store.phoneNumber)}</p> 
        <p style={{textAlign: "left"}}>Opening hours:</p>
        <table>
          <tbody>
            {hours.map(h => {
              return (<tr key={Math.random()}>{displayHours(h)}</tr>)
            })}
          </tbody>
        </table>
      </div>
    );
  };

export default Map;