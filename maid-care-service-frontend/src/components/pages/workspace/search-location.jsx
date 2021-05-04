import FlexBox from '../../shared/FlexBox';
import * as Yup from 'yup';
import { TextInputField } from '../../shared/FormikField';
import { workspace } from '../../../api';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../../hooks/use-stores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Box } from '@chakra-ui/layout';
import { Input } from '@chakra-ui/input';

const SearchLocation = ({ panTo, setMarkers }) => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinaates] = useState({
    lat: null,
    lng: null,
  });

  const handleSelect = async value => {
    try {
      const result = await geocodeByAddress(value);
      const latLng = await getLatLng(result[0]);
      setAddress(value);
      setCoordinaates(latLng);
      panTo(latLng);
      setMarkers([{ ...latLng, time: new Date() }]);
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  return (
    <Box zIndex={1}>
      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <Box pos="relative">
            <Input w="300px" {...getInputProps({ placeholder: 'Search your location....' })} />
            <Box pos="absolute" w="300px">
              {loading ? <div>...loading</div> : null}
              {suggestions.map(suggestion => {
                const style = {
                  backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                };
                return (
                  <Box
                    w="300px"
                    h="35px"
                    lineHeight="35px"
                    paddingLeft="15px"
                    fontFamily="Roboto"
                    fontSize="15px"
                    color="gray.600"
                    fontWeight="300px"
                    overflow="hidden"
                    bg="#fff"
                    boxShadow="0 2px 6px rgba(0, 0, 0, 0.3)"
                    {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </PlacesAutocomplete>
    </Box>
  );
};

export default SearchLocation;
