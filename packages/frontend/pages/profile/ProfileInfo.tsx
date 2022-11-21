import { Container, Image, Text, VStack, Circle } from '@chakra-ui/react'
import React from 'react'
import { useEnsName, useAccount, useEnsAvatar,  useEnsAddress } from 'wagmi'


function ProfileInfo() {

    const { address, isConnecting, isDisconnected } = useAccount()

    //   const result = useEnsAvatar({
    //      address: '0x765374f6E28879cC3f75138e008c0f2AB9Dbe1D9',
    //     })
        
        

  return (
    <Container padding={'2rem'}>
        <VStack>
            <Circle size='10rem' backgroundColor={'green.100'}/>
            <VStack>
                <Text as='b'>
                    turja.eth 
                </Text>
            </VStack>
            <VStack>
                <Text>
                {address}
                </Text>
            </VStack>
            
        </VStack>
    </Container>
  )
}

export default ProfileInfo