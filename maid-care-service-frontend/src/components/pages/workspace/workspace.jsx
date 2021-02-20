/*
    To test this system, you will need
        - Google map api keys
            - enable Geocoding API for convert between addresses and geographic coordinates.
            - enable Maps JavaScript API 
            - enable Places API for recommended places based on the keywords you enter.
*/ 

import React, {useState, useCallback, useRef} from "react";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
  
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// this package is for relocating when user enters the location in the search box
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
    height: "100vh",
    width: "100vw",
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

    const panTo = React.useCallback( ({lat, lng})  => {
        mapRef.current.panTo( {lat, lng} );
        mapRef.current.setZoom(14);
    })
    
    if (isLoadError) return "Error loading maps";
    if(!isLoaded) return "Loading Mpas";
    return (
        <div><h1>Grap maid (This for header)</h1>
            <Search  panTo={panTo}/>
            <LocateMe  panTo={panTo}/>
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
                            <h2>new workspace</h2>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    );
}

export default Workspace;


function Search( {panTo} ) {
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions} = usePlacesAutocomplete({
            requestOptions: {
                location: { lat: () => 13.7563,lng: () => 100.5018 },
                radius: 200 * 1000,
            }
        });

    return (
        <div className="workspace-search">
            <Combobox
                onSelect={ async (address) => {
                    setValue(address, false);
                    clearSuggestions();
                    try {
                        const results = await getGeocode( {address} );
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo( {lat, lng} );
                    } catch(error) {
                        console.log("Error");
                    }
                }}
            >
                <ComboboxInput
                    placeholder="Search" 
                    value={value} 
                    onChange={ (event) => { setValue(event.target.value); } }
                    disabled ={ !ready }
                />
                <ComboboxPopover>
                    <ComboboxList>
                        { status === "OK" && data.map( ({id, description}) => (
                            <ComboboxOption key={id} value={description}/>
                        ))}
                    </ComboboxList>
                </ComboboxPopover>  
            </Combobox>
        </div>
    );
}

function LocateMe( {panTo} ) {
    return (
        <button 
            className="button-locateMe"
            onClick={ () => {
                navigator.geolocation.getCurrentPosittion(
                    (position) => {panTo( {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => null)
            }}
        >
            Locate Me
        </button>
    )
}