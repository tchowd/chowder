// import { useEffect, useState } from 'react';

import { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { VStack, Text, Button, Circle, Input, Box, Container, Center } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PendingImages from "../profile/PendingImages";
import ProfileInfo from "../profile/ProfileInfo";



const UploadFile: NextPage = () => {
  const [value, setValue] = useState('0.02')
  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>('');
  const [file, setFile] = useState<Buffer>()
  const [image, setImage] = useState('')
  const hiddenFileInput = useRef(null);
  const [URI, setURI] = useState('')




    useEffect(() => {
        if (bundlrInstance) {
            fetchBalance();
        }
    }, [bundlrInstance])

    function onFileChange(e: any) {
      const file = e.target.files[0]
      if (file) {
          const image = URL.createObjectURL(file)
          setImage(image)
          let reader = new FileReader()
          reader.onload = function () {
              if (reader.result) {
                  setFile(Buffer.from(reader.result as any))
              }
          }
          let test = reader.readAsArrayBuffer(file)
          return test;
      }
  }
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    async function uploadFile(file) {
            let tx = await bundlrInstance.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }, {name: "Content-Type", value: "text/rtf"}])
            return tx;
    }

    const handleUpload = async () => {
        const res = await uploadFile(file);
        console.log('res.data', res.data);
        setURI(`http://arweave.net/${res.data.id}`)
    }


    const initialiseBundlr = async () => {
        const provider = new providers.Web3Provider(window.ethereum as any);
        await provider._ready();
        const bundlr = new WebBundlr(
            "https://devnet.bundlr.network",
            "matic",
            provider,
            {
                providerUrl:
                    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
            }
        );
        await bundlr.ready();
        setBundlrInstance(bundlr);

    }

    async function fundWallet(amount: number) {
        try {
            if (bundlrInstance) {
                if (!amount) return
                const amountParsed = parseInput(amount)
                if (amountParsed) {
                    let response = await bundlrInstance.fund(amountParsed)
                    console.log('Wallet funded: ', response)
                }
                fetchBalance()
            }
        } catch (error) {
            console.log("error", error);
        }
    }


    function parseInput(input: number) {
        const conv = new BigNumber(input).multipliedBy(bundlrInstance!.currencyConfig.base[1])
        if (conv.isLessThan(1)) {
            console.log('error: value too small')
            return
        } else {
            return conv
        }
    }


    async function fetchBalance() {
        if (bundlrInstance) {
            const bal = await bundlrInstance.getLoadedBalance();
            console.log("bal: ", utils.formatEther(bal.toString()));
            setBalance(utils.formatEther(bal.toString()));
            console.log("updated balance: ", utils.formatEther(bal.toString()))
        }
    }
  
    if (!bundlrInstance) {
        return (
          <div className='justify-center items-center h-screen flex '>
            <VStack gap={8}>
              <ConnectButton />
              <Text className='text-4xl font-bold'>
                Let's initialise Bundlr now
              </Text>
              <Button className='mt-10' onClick={initialiseBundlr}>Initialise Bundlr</Button>
            </VStack>
          </div>
        )
      }

   
  return (
    <div>
        <ProfileInfo />
            <Container maxW={'7xl'}>
                <Center>
                
                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'whiteAlpha.400'} padding={'1rem'} width={'20rem'} height={'10rem'}>
                <Center>
                    <VStack>
                    <Text fontSize={'sm'}>
                        Current balance: {balance || 0} $BNDLR
                    </Text>
                    <Input
                    placeholder="add funds"
                    onChange={(e) => setValue((e as any).target.value)}
                    />
                    <Button onClick={() => fundWallet(+value)}>💸 Add Fund</Button>
                    </VStack>
                </Center>
                </Box>

                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'whiteAlpha.400'} padding={'1rem'} width={'20rem'} height={'10rem'}>
                <Center>
                    <VStack>
                    <Text fontSize={'xl'}>
                        Confirm Geolocation
                    </Text>
                    <Input
                    placeholder="add funds"
                    onChange={(e) => setValue((e as any).target.value)}
                    />
                    <Button onClick={() => fundWallet(+value)}>💸 Add Fund</Button>
                    </VStack>
                </Center>
                </Box>
                            
                            </Center>
                            
            </Container>
            
                {balance && (
                    <div>
                        <Center>
                        <Box>
                            <Text> Get started</Text>
                        <Button onClick={handleClick} className='mb-4'>
                                {image ? 'Change Selection' : 'Select Image'}
                            </Button>
                            <input
                                accept="image/png, image/gif, image/jpeg, text/rtf, video/mp4"
                                type="file"
                                ref={hiddenFileInput}
                                onChange={onFileChange}
                                style={{ display: 'none' }}
                            />
                            </Box>
                            </Center>
                        {
                            image &&
                            <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                width='100%'
                                py={40}
                                bgImage={`url('${image}')`}
                                bgPosition='center'
                                bgRepeat='no-repeat'
                                mb={2}
                            >
                                <button className='bg-gray-200 rounded px-8 py-2 text-black hover:bg-gray-100' onClick={handleUpload}>Upload File</button>
                            </Box>
                        }
                        
                        <a href={URI} target="_blank">{URI}
                        <Box position={'relative'}
                            width={'18rem'}
                            borderRadius={'1rem'}
                            overflow={'hidden'}
                            bgImage={`url('${image}')`}
                            height={'15rem'}
                            // backgroundColor={'gray.100'}
                            zIndex={-1}
                            padding={'0.6rem'} />  
                            </a>
                        {
                            URI && <Text>
                                <Text fontSize='xl'> Uploaded File:</Text> <a href={URI} target="_blank">{URI}</a>
                            </Text>
                        }
                        
                    </div>
                )
            }
            {balance && !image ? <PendingImages/> : null}
                </div>
  );
};

export default UploadFile;
