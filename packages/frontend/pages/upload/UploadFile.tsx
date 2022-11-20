// import { useEffect, useState } from 'react';

import { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { VStack, Text, Button, Circle, Input, Box, Container, Center, Divider } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PendingImages from "../profile/PendingImages";
import ProfileInfo from "../profile/ProfileInfo";
import { GrLocation } from 'react-icons/gr';
import GeoLocation from "../profile/GeoLocation";
import { readFileSync } from "fs";
import abi from "../../utils/uploadStorage.json"
import { ethers } from "ethers";
import { stripZeros } from "ethers/lib/utils";



type Props = {
    upload: any;
  };


function UploadFile()  {
  const [value, setValue] = useState('')
  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>('');
  const [file, setFile] = useState<Buffer>()
  const [image, setImage] = useState('')
  const hiddenFileInput = useRef(null);
  const [URI, setURI] = useState('')
  const contractAddress = "0x47b837D8F4D14Bf78C608f1a33F35DB8BE325Ca6";


  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contractABI = abi.abi;
    const uploadStorage = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
  }

//   const getHashes = async() => {
//     uint256 size = uploadStorage.uploads.size();
//     string hash[size];
//     for(int j = 0; i < size; i++){
//         hash[j] = uploadStorage.uploads[j];
//     }
//   }

//   const getImage(string hash) {

//   }

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
        // const data = readFileSync(file)
        let tx = await bundlrInstance?.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }, {name: "Content-Type", value: "text/plain"}])
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
                
                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'white'} padding={'1rem'} width={'20rem'} height={'11rem'} marginRight={'2rem'}>
                <Center>
                    <VStack>
                        <VStack>
                            <Text fontSize={'sm'}>
                            $BNDLR Balance: 
                            </Text>
                            </VStack>
                            <VStack>
                            <Text fontSize={'sm'}>
                                {balance || 0} 
                            </Text>
                         </VStack>
                         
                    <Input
                    placeholder="add funds"
                    onChange={(e) => setValue((e as any).target.value)}
                    />
                    <Button onClick={() => fundWallet(+value)}>💸 Add Fund</Button>
                    </VStack>
                </Center>
                </Box>

                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'white'} padding={'1rem'} width={'20rem'} height={'11rem'}>
                <Center marginTop={'1rem'}>
                    <VStack>
                    <Text fontSize={'sm'}>
                        Proof of Location
                    </Text>
                  
                    <GeoLocation />

                    <Text fontSize={'sm'}>
                        Why should I share my location?
                    </Text>
                    </VStack>
                </Center>
                </Box>
                            
                            </Center>

                            <Divider maxW={'8xl'} paddingTop={'2rem'}/>
            </Container>
           
            
                {balance && (
                    <div>
                        <Center>
                        <Box>
                            <VStack>
                            <Text paddingTop={'5rem'} fontSize={'xl'}> Select an image or video to get started:</Text>
                            <Button onClick={handleClick} className='mb-4'>
                                {image ? 'Change Selection' : 'Select Image'}
                            </Button>
                            </VStack>
                            <input
                                accept="image/png, image/gif, image/jpeg, text/rtf, video/mp4"
                                type="file"
                                ref={hiddenFileInput}
                                onChange={onFileChange}
                                style={{ display: 'none' }}
                            />
                            </Box>
                            </Center>
                            <Center marginTop={'3rem'}>
                            <VStack>
                        {
                            image && 
                            <>
                            <VStack>
                            <Box
                                position={'relative'}
                                bgImage={`url('${image}')`}
                                width={'18rem'}
                                borderRadius={'1rem'}
                                overflow={'hidden'}
                                // bgImage={`url('${image}')`}
                                height={'15rem'}
                                // backgroundColor={'gray.100'}
                                zIndex={1}
                                padding={'0.6rem'}
                            >
                             <Center marginTop={'5rem'}>
                                <Button className='bg-gray-200 rounded px-8 py-2 text-black hover:bg-gray-100' onClick={handleUpload}>Upload File</Button>
                            </Center>
                            </Box>
                            </VStack>
                            </>
                            
                            
                        }
                       
                        { URI &&  
                            <a href={URI} target="_blank"> 
                                <Button> View Image</Button>
                             </a>
                        }
                        </VStack>
                            
                        </Center>
                        
                        {/* <Box position={'relative'}
                            width={'18rem'}
                            borderRadius={'1rem'}
                            overflow={'hidden'}
                            bgImage={`url('${image}')`}
                            height={'15rem'}
                            // backgroundColor={'gray.100'}
                            zIndex={-1}
                            padding={'0.6rem'} />  
                          <a href={URI} target="_blank"> 
                          <Button> View Image</Button>
                           </a> */}
                        {/* {
                            URI && <Text>
                                <Text fontSize='xl'> Uploaded File:</Text> <a href={URI} target="_blank">{URI}</a>
                            </Text>
                        } */}
                        
                    </div>
                )
            }
            {balance && !image ? <PendingImages/> : null}
                </div>
  );
};

export default UploadFile;
