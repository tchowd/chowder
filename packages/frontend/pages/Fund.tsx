// import { useEffect, useState } from 'react';

import { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { VStack, Text, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Input, Box, Link } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UploadFile from "./upload/UploadFile";


const Fund: NextPage = () => {

  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
  const [balance, setBalance] = useState<string>('');
  const [value, setValue] = useState('0.02')

    useEffect(() => {
        if (bundlrInstance) {
            fetchBalance();
        }
    }, [bundlrInstance])


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
      <Text fontSize={'xl'}>
                    Your current balace is: {balance || 0} $BNDLR
                </Text>
                <Input
                  
                  placeholder="add funds"
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

                <Link href='/upload'>
                <Button>
                  Go to Upload Page
                </Button>
                </Link>
    </div>
  );
};

export default Fund;
