import {
    Box,
    Center,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
  } from '@chakra-ui/react';
  import { FaInstagram, FaLinkedin, FaTwitter, FaGithub, FaTelegram } from 'react-icons/fa';
  import { ReactNode } from 'react';
  
  
  export default function Footer() {
    return (
      <Box marginTop={'9rem'}>   
        <Center>
          <Text>chowder © 2022 </Text>
          </Center>
      </Box>
    );
  }
  