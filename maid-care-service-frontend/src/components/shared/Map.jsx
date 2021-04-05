// Note for Map component.
// - you need to pass latitude and longitude as a parameter.
// - size of map is width = 100%, height = 100%, if you want to edit size => you can cover them with a box tag or whatever tag you want and then adjust size of that tag.

import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
const libraries = ['places'];

export const Map = ({ latitude, longitude }) => {
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
    lng: longitude,
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
      onLoad={onMapLoad}

      >
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
};

export default Map;
