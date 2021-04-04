/*
    To test this system, you will need
        - Google map api keys
            - enable Geocoding API for convert between addresses and geographic coordinates.
            - enable Maps JavaScript API 
            - enable Places API for recommended places based on the keywords you enter.
*/

import React, { useState } from 'react';

import {
  Box,
  Center,
} from '@chakra-ui/react';

import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

// this package is for relocating when user enters the location in the search box

const libraries = ['places'];

// defauleCenter is default position when page is rerendering.
// default position is latitude and longtitude of Bangkok.
const defauleCenter = {
  lat: 13.7563,
  lng: 100.5018,
};

// mapContainerStyle is height and width of map window.

export const Map = ( {latitude, longtitude, width, height} ) => {
  const { isLoaded, isLoadError } = useLoadScript({
    // add your google maps API Keys.
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const mapContainerStyle = {
    height: height,
    width: width,
  };

  // markers is variable that contain a map marker icon which created by user when they click on the map.

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  });

  if (isLoadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';
  return (
    <Box bg="gray.200" w="100%" h="100%">
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={defauleCenter}
          onLoad={onMapLoad}>
          <Marker position={{ lat: latitude, lng: longtitude }}/>
        </GoogleMap>
    </Box>
  );
};

export default Map;