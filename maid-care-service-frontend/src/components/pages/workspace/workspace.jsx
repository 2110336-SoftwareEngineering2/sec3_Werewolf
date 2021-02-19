import React from "react";
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
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    });
    
    return (
      <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={defauleCenter}

      ></GoogleMap>
 );
}

export default Workspace;