import { Button, HStack, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { GrLocation } from 'react-icons/gr';

function GeoLocation() {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [status, setStatus] = useState('');

    const getLocation = () => {
        if (!navigator.geolocation) {
			setStatus('Geolocation is not supported by your browser');
		} else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }, () => {
                setStatus('Unable to retrieve your location');
            });
        }
    }
  return (
    <div>

            <Button 
                borderRadius={'1rem'}
                px={6}
                colorScheme={'white'}
                bg={'black'}
                onClick={getLocation}
                textDecoration={'none'}
                _hover={{ backgroundColor: 'white', color: 'black', borderColor: 'black', border: '1px', textDecoration: 'none'}}>
               
           <GrLocation /> Confirm Location 
        </Button>
        { lat && lng ?
         <HStack> <Text> {lat}</Text> <Text> {lng}</Text> </HStack>
            :
            null
        }

			{/* {lat && <p> {lat}</p>}
			{lng && <p>Longitude: {lng}</p>} */}
		</div>
  )
}

export default GeoLocation