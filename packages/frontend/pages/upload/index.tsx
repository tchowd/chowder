// import { useEffect, useState } from 'react';

import { NextPage } from "next";
import { useEffect, useState, useRef } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { VStack, Text, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Input, Box } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UploadFile from "./UploadFile";
import Fund from "./Fund";


const Upload: NextPage = () => {

  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();

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
      <Fund />
      <UploadFile />

    </div>
  );
};

export default Upload;
