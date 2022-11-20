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
import Navbar from "../components/Navbar";
import ProfileInfo from "../profile/ProfileInfo";


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

  return (

    <Box
        w='100%'
        h='100rem'
        bgGradient='linear(to-r, gray.300, purple.50, yellow.50, purple.50, gray.300)'
      >
    <Navbar />
    <UploadFile />
    </Box>
  );
};

export default Upload;
