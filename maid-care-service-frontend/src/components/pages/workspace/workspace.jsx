import React, {useState, useCallback, useRef} from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
import { date } from "yup";

const libraries = ["places"];

// defauleCenter is default position when page is rerendering.
// default position is latitude and longtitude of Bangkok.
const defauleCenter = {
    lat: 13.7563,
    lng: 100.5018
};

// mapContainerStyle is height and width of map window.
const mapContainerStyle = {
    height: "80vh",
    width: "80vw",
};


export const Workspace = () => {
    const {isLoaded, isLoadError} = useLoadScript({
        // add your google maps API Keys.
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    });

    // markers is variable that contain all the map marker that created by user when they click on the map. 
    const [markers, setMarkers] = React.useState([]);
    // selected is variables that 
    const [selected, setSelected] = React.useState(null);

    // onMapClick is a function that create map marker when user click on the map. 
    const onMapClick = React.useCallback((event) => {
      setMarkers((current) => [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          time: new Date(),
        },
      ]);
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback( (map) => {
        mapRef.current = map;
    }, []);
    
    if (isLoadError) return "Error loading maps";
    if(!isLoaded) return "Loading Mpas";
    return (
        <>
            <div><h1>Grap maid (This for header)</h1></div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={defauleCenter}
                onClick={onMapClick}
                onLoad = {onMapLoad}
            >
                {markers.map( (marker) => (
                    <Marker
                        key = {marker.time.toISOString()}
                        position={ { lat : marker.lat, lng: marker.lng} }
                        onClick={() => {setSelected(marker);}}
                    />
                ))
                }

                {selected ? (
                    <InfoWindow
                        position = { {lat : selected.lat, lng: selected.lng} }
                        onCloseClick={() => { setSelected(null); }}
                    >
                        <div>
                            <h2>
                                new workspace
                            </h2>
                            <p>Spotted</p>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </>
    );
}

export default Workspace;