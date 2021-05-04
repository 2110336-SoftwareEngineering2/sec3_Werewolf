/*
    To test this system, you will need
        - Google map api keys
            - enable Geocoding API for convert between addresses and geographic coordinates.
            - enable Maps JavaScript API 
            - enable Places API for recommended places based on the keywords you enter.
*/

import React, { useCallback, useRef, useState } from 'react';
import { Center, Button, Box } from '@chakra-ui/react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
// this package is for relocating when user enters the location in the search box
import InfoSidebar from './info-sidebar';

const libraries = ['places'];

// defauleCenter is default position when page is rerendering.
// default position is latitude and longtitude of Bangkok.
const defauleCenter = {
  lat: 13.7563,
  lng: 100.5018,
};

// mapContainerStyle is height and width of map window.
const mapContainerStyle = {
  height: '900px',
  width: '1000px',
};

export const Workspace = () => {
  const { isLoaded, isLoadError } = useLoadScript({
    // add your google maps API Keys.
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // markers is variable that contain a map marker icon which created by user when they click on the map.
  const [markers, setMarkers] = useState([]);

  // onMapClick is a function that create map marker icon when user click on the map.
  const onMapClick = useCallback(event => {
    setMarkers(() => [
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback(map => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (isLoadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';
  return (
    <Box bg="gray.200" h="100vh">
      <Center mt="20px">
        <InfoSidebar panTo={panTo} markers={markers} setMarkers={setMarkers} />
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={defauleCenter}
          onClick={onMapClick}
          onLoad={onMapLoad}>
          <LocateMe panTo={panTo} />
          {markers.map(marker => (
            <Marker
              key={marker.time.toISOString()}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
      </Center>
    </Box>
  );
};

export default Workspace;

// This is a function which locate user location by get latitude and longtitude from user GPS.
// To make this function works, user must give permission in their browser.

// This function get location by use navigator.geolocation.getCurrentPosition(...)
// ,then pass latitude and longtitde as a parameter to panTo function which is a function that
// pan a google map window to the latitude and longtitde.
const LocateMe = ({ panTo }) => {
  return (
    <Button
      boxShadow="xl"
      color="white"
      w="100px"
      position="absolute"
      bottom="30px"
      right="400px"
      bg="buttonGreen"
      className="button-locateMe"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          position => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}>
      Locate Me
    </Button>
  );
};
