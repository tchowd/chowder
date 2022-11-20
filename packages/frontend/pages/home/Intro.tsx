import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Icon,
    IconProps,
    Link,
  } from '@chakra-ui/react';
  
  export default function Intro() {
    return (
      <Container maxW={'5xl'} marginTop={'5rem'}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}>
          <Heading
            bgGradient='linear(to-l, #7928CA, #FF0080)'
            bgClip='text'
            fontSize='6xl'
            fontWeight='extrabold'>
            Storage with full {' '} user autonomy  
          </Heading>
          <Text color={'gray.500'} maxW={'3xl'} fontSize={'l'}>
            Brew storage that can never be taken down. Decentralized storage platform to store content on-chain with proof-of-location validation.
          </Text>
          <Stack spacing={6} direction={'row'}>
            <Link href='/upload'>
            <Button
              // rounded={'full'}
              // href='/upload'
              borderRadius={'1rem'}
              px={6}
              colorScheme={'white'}
              bg={'black'}
              textDecoration={'none'}
              _hover={{ bgGradient: 'linear(to-l, #7928CA, #FF0080)', textDecoration: 'none'}}>
              Start For Free
            </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    );
  };