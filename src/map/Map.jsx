
import GoogleMapReact from 'google-map-react';
import './Map.css';
import { Room } from '@material-ui/icons';

const Map = ({ customer, storesLocation, initGeocoder }) => {

    const defaultLocation = {
        address: customer?.customerAddress || "default address",
        lat: 45.507220,
        lng: -73.768610
      };

    return(
        <div className="Map">
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.REACT_MAPS_API || "",
                }}
                defaultCenter={defaultLocation}
                defaultZoom={12}
                options={{ disableDefaultUI: true, gestureHandling: "cooperative", zoomControl: false }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={initGeocoder}
                >
                {customer && <Marker color={"green"} lat={customer.location.lat} lng={customer.location.lng} />}
                {storesLocation && storesLocation.map(s => {
                    return (<Marker color={"red"} key={s.storeId} lat={s.location.lat} lng={s.location.lng} />)
                })}
            </GoogleMapReact>
        </div>
    )
}

const Marker = ({color}) => {
    return (
        <Room style={{fill: color}} fontSize="large"/>
    );
  };

export default Map;