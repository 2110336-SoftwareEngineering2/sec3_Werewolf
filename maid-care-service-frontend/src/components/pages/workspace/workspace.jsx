/*
    To test this system, you will need
        - Google map api keys
            - enable Geocoding API for convert between addresses and geographic coordinates.
            - enable Maps JavaScript API 
            - enable Places API for recommended places based on the keywords you enter.
*/ 

import React, {useState, useCallback, useRef} from "react";
import FlexBox from "../../shared/FlexBox";
import MaidLogo from "../../../MaidLogo.svg";

import {
    Box,
    chakra,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    Center,
    Button,
    Link,
    Text,
    flexbox,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
  } from "@chakra-ui/react";

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
    height: "900px",
    width: "1000px",
};


export const Workspace = () => {
    const {isLoaded, isLoadError} = useLoadScript({
        // add your google maps API Keys.
        googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [houseNo, setHouseNo] = React.useState("");
    const [address1, setAddress1] = React.useState("");
    const [address2, setAddress2] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const handleHouseNo = (event) => setHouseNo(event.target.value);
    const handleAddress1 = (event) => setAddress1(event.target.value);
    const handleAddress2 = (event) => setAddress2(event.target.value);
    const handleCity = (event) => setCity(event.target.value);
    const handleState = (event) => setState(event.target.value);

    // markers is variable that contain all the map marker that created by user when they click on the map. 
    const [markers, setMarkers] = React.useState([]);
    // selected is variables that 
    const [selected, setSelected] = React.useState(null);

    // onMapClick is a function that create map marker when user click on the map. 
    const onMapClick = React.useCallback((event) => {
      setMarkers(() => [
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
        <Box bg="gray.200" h="100vh">
            <GrabmaidHeader/>
            <Center mt="20px">
                <InfoSidebar 
                    houseNo={houseNo}
                    address1={address1}
                    address2={address2}
                    city={city}
                    state={state}
                    handleHouseNo={handleHouseNo} 
                    handleAddress1={handleAddress1} 
                    handleAddress2={handleAddress2} 
                    handleCity={handleCity} 
                    handleState={handleState} 
                    panTo={panTo}/>
                <GoogleMap
                    id="map"
                    mapContainerStyle={mapContainerStyle}
                    zoom={8}
                    center={defauleCenter}
                    onClick={onMapClick}
                    onLoad = {onMapLoad}
                >
                    <LocateMe  panTo={panTo}/>
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
            </Center>
        </Box>
    );
}

export default Workspace;

const InfoSidebar = ( {houseNo, address1, address2, city, state, handleHouseNo, handleAddress1, handleAddress2, handleCity, handleState, panTo} ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()
    return (
        <FlexBox>
          <VStack spacing="20x" h="850px" w="350px">
            <Box fontSize="3xl" mb="15px" fontWeight="extrabold">New workspace</Box>
            <SearchLocation  panTo={panTo}/>

            <FormControl id="house-no" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">House no.</FormLabel>
                <Input placeholder="Text Here" className="formField" value={houseNo} onChange={handleHouseNo}/>
            </FormControl>
            <FormControl id="address-1" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">Address 1</FormLabel>
                <Input placeholder="Text Here" className="formField" value={address1} onChange={handleAddress1}/>
            </FormControl>
            <FormControl id="address" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">Address 2</FormLabel>
                <Input placeholder="Text Here" className="formField" value={address2} onChange={handleAddress2}/>
            </FormControl>
            <FormControl id="city" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">City</FormLabel>
                <Input placeholder="Text Here" className="formField" value={city} onChange={handleCity}/>
            </FormControl>
            <FormControl id="state" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">State</FormLabel>
                <Input placeholder="Text Here" className="formField" value={state} onChange={handleState}/>
            </FormControl>
            <FormControl id="country" width={{sm:"270px",md:"368px"}}>
                <FormLabel mb="0">Country</FormLabel>
                <Input placeholder="Text Here" className="formField" value={"Thailand"}/>
            </FormControl>

            <Center>
                <Button boxShadow="xl" w="200px" className="button" mt="25px" mb="10px" ml="30px" bg="buttonGreen" onClick={() => setIsOpen(true)} >Confirm</Button>
            </Center>



            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Add this places to your saved places?
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Your address : house no. {houseNo} {address1} {address2} {city} {state} Thailand
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="green" onClick={onClose} ml={3}>
                            Confirm
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>


          </VStack>
        </FlexBox>
    );
}


const SearchLocation = ( {panTo} ) => {
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
        <Box  >
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
        </Box>
    );
}

const LocateMe = ( {panTo} ) => {
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

const GrabmaidHeader = () => {
    return (
        <Box w="100%" h="40px" bg="brandGreen" color="white">
            <chakra.img src={MaidLogo} h="30px" ml="100px" />
        </Box>
    );
}