
import GoogleMapReact from 'google-map-react';
import './Map.css';
import { Room, Home } from '@material-ui/icons';

const Map = ({ customer, storesLocation, initGeocoder }) => {

    const defaultLocation = {
        address: "default address",
        lat: 45.5076627,
        lng: -73.7251843
      };

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
                {customer && <Marker type={"home"} color={"#000369"} lat={customer.location.lat} lng={customer.location.lng} />}
                {storesLocation && storesLocation.map(s => {
                    return (<Marker type={"store"} color={"#a11606"} key={s.storeId} lat={s.location.lat} lng={s.location.lng} />)
                })}
            </GoogleMapReact>
        </div>
    )
}

const Marker = ({color, type}) => {
    return (
        type === "home" ? <Home style={{fill: color}} fontSize="medium"/> : <Room style={{fill: color}} fontSize="medium"/>
    );
  };

export default Map;