import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
const libraries = ['places'];

// Note for Map component.
// - you need to pass latitude and longtitude as a parameter.
// - size of map is width = 100%, height = 100%, if you want to edit size => you can wrap them with a box tag or whatever and then adjust size of that box tag.


export const Map = ({ latitude, longtitude }) => {
  const { isLoaded, isLoadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
  };

  const defauleCenter = {
    lat: latitude,
    lng: longtitude,
  };

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);


  if (isLoadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={defauleCenter}
      onLoad={onMapLoad}>
      <Marker position={{ lat: latitude, lng: longtitude }} />
    </GoogleMap>
  );
};

export default Map;
