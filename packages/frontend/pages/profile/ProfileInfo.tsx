import { Container, Image, Text, VStack, Circle } from '@chakra-ui/react'
import React from 'react'
import { useEnsName, useAccount, useEnsAvatar,  useEnsAddress } from 'wagmi'


function ProfileInfo() {

    const { address } = useAccount()

    const { data, isError, isLoading } = useEnsName({
        address,
      })

  return (
    <Container padding={'2rem'}>
        <VStack>
            <Circle size='10rem' backgroundColor={'green.100'}/>
            <VStack>
                <Text as='b'>
                    {data}
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