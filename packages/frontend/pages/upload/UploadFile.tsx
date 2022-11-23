// import { useEffect, useState } from 'react';

import { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, Signer, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { VStack, Text, Button, Circle, Input, Box, Container, Center, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, HStack } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PendingImages from "../profile/PendingImages";
import ProfileInfo from "../profile/ProfileInfo";
import { GrLocation } from 'react-icons/gr';
import GeoLocation from "../profile/GeoLocation";
import { readFileSync } from "fs";
import abi from "../../utils/uploadStorage.json"
import { ethers } from "ethers";
import { stripZeros } from "ethers/lib/utils";
import {useAccount} from 'wagmi'
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";



type Props = {
    upload: any;
  };


function UploadFile()  {
  const [value, setValue] = useState('')
  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>('');
  const [file, setFile] = useState<Buffer>()
  const [image, setImage] = useState('')
  const hiddenFileInput = useRef<HTMLDivElement>(null);
  const [URI, setURI] = useState('')
  const [currentUploads, setCurrentUploads] = useState(0);
  const [hash, setHash] = useState();
  const contractAddress = "0x47b837D8F4D14Bf78C608f1a33F35DB8BE325Ca6";
 const {address} = useAccount()
 let uploadStorageContract:any;
//   if (window.ethereum) {
//     console.log(address);
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    // const signer = jsonRpcProvider.getSigner([address]);
//     // console.log(signer);
    const signer = provider.getSigner();
    const contractABI = abi.abi;
    uploadStorageContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    console.log(uploadStorageContract);
//   }

  const uploads = uploadStorageContract.upload;
//   setCurrentUploads(uploads.toNumber());
  console.log(uploads[0])



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
    const handleClick = (e: any) => {
        hiddenFileInput?.current?.click();
    };

    //  const handleClick = (_event: any) => {
    //      hiddenFileInput?.current?.click();
    //  };

    async function uploadFile(file: any) {
        // const data = readFileSync(file)
        let tx = await bundlrInstance?.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }, {name: "Content-Type", value: "text/plain"}])
        console.log(tx?.data.id);
        let storeHash = tx?.data.id;
        // console.log(storeHash)
        // let d = await uploadStorageContract.addUpload(0,tx)
        // let d = await signer.signMessage(uploadStorageContract.addUpload(0, storeHash), "0x00");
        // let d = await uploadStorageContract.send({from:address}).addUpload(0, "hello");
        // await d.wait();
        // console.log(d);
        return tx;
    }
    


    const handleUpload = async () => {
        const res = await uploadFile(file);
        // console.log('res.data', res.data);
        // hiddenFileInput?.current.click();
        setURI(`http://arweave.net/${res?.data.id}`)
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
            <>
            <Center marginTop={'10rem'} marginBottom={'18rem'}>
            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'white'} padding={'1rem'} width={'60rem'} height={'15rem'} marginRight={'2rem'}>
            <VStack gap={8} marginTop={'3rem'}>
              <ConnectButton />
              <Button
              onClick={initialiseBundlr}
              borderRadius={'1rem'}
              px={6}
              colorScheme={'white'}
              bg={'black'}
              textDecoration={'none'}
              _hover={{ backgroundColor: 'white', color: 'black', borderColor: 'black', border: '1px', textDecoration: 'none'}}>Initialise Bundlr</Button>
            </VStack>
          </Box>
          </Center>
          </>
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
                            <Text fontSize={'sm'} as='b'>
                            $BNDLR Balance: 
                            </Text>
                            </VStack>
                            <VStack>
                            <Text fontSize={'sm'}>
                                {balance || 0} 
                            </Text>
                         </VStack>
                         
                    <Input
                    placeholder="Add Funds"
                    onChange={(e) => setValue((e as any).target.value)}
                    />
                    <Button 
                borderRadius={'1rem'}
                px={6}
                colorScheme={'white'}
                bg={'black'}
                textDecoration={'none'}
                _hover={{ backgroundColor: 'white', color: 'black', borderColor: 'black', border: '1px', textDecoration: 'none'}}
                onClick={() => fundWallet(+value)}> Add Fund</Button>
                    </VStack>
                </Center>
                </Box>

                <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' backgroundColor={'white'} padding={'1rem'} width={'20rem'} height={'11rem'}>
                <Center marginTop={'1rem'}>
                    <VStack>
                    <Text fontSize={'sm'} as='b'>
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
           
            
            <Tabs  variant='soft-rounded' marginTop={'3rem'}>
            <Container maxW={'5xl'}>
                <TabList>
                    <Tab>Upload</Tab>
                    <Tab>All Uploads</Tab>
                </TabList>
            </Container>

                <TabPanels>
                    <TabPanel>
                    {balance && (
                    <div>
                        <Center>
                        <Box>
                            <VStack>
                            <Text paddingTop={'1rem'} fontSize={'xl'}> Select an image or video to get started:</Text>
                            <Button 
                                borderRadius={'1rem'}
                                px={6}
                                colorScheme={'white'}
                                bg={'black'}
                                textDecoration={'none'}
                                _hover={{ backgroundColor: 'white', color: 'black', borderColor: 'black', border: '1px', textDecoration: 'none'}}
                                onClick={handleClick}> 
                                {image ? 'Change Selection' : 'Select Image'}
                            </Button>
                            </VStack>
                            <input
                                accept="image/png, image/gif, image/jpeg, text/rtf, video/mp4"
                                type="file"
                                ref={hiddenFileInput as React.MutableRefObject<HTMLInputElement>}
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
                                maxWidth={'100%'}
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
                        
                        
                    </div>
                )
            }
            {balance && !image ? <PendingImages/> : null}
                    </TabPanel>
                    <TabPanel>
                           

                    <Container maxW={'4xl'} marginTop={'2rem'}>
                        <HStack zIndex={1}>
                            changes coming soon
                        </HStack>

                        
                    </Container> 
                    </TabPanel>
                </TabPanels>
                </Tabs>
                
                
                </div>
  );
};

export default UploadFile;
