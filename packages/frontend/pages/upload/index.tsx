import { NextPage } from "next";
import { useState } from "react";
import { WebBundlr } from '@bundlr-network/client';
import { providers, utils } from 'ethers';
import { Box } from "@chakra-ui/react";
import UploadFile from "./UploadFile";
import Navbar from "../components/Navbar";


const Upload: NextPage = () => {

  return (

    <Box
        w='100%'
        h='110rem'
        bgGradient='linear(to-r, gray.300, purple.50, yellow.50, purple.50, gray.300)'
      >
    <Navbar />
    <UploadFile />
    </Box>
  );
};

export default Upload;
