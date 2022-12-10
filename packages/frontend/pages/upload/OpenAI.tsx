

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const UploadStorage2 = () => {
    const [contract, setContract] = useState<ethers.Contract>();
    const [numHashes, setNumHashes] = useState<number>();
    const [imageHashes, setImageHashes] = useState<string[]>();
    const [imageName, setImageName] = useState<string[]>();

    useEffect(() => {
        (async () => {
            const provider = new ethers.providers.JsonRpcProvider(
                'http://localhost:8545'
            );
            const signer = provider.getSigner(0);
            const contract = new ethers.Contract(
                '0x8d7aC5B5c5b5A5b5DC5b5A5b5A5b5C5B5B5B5A5',
                [
                    'function setImgHash(string memory _imgHash, string memory _imgName) public',
                    'function getImgHash(uint _index) public view returns(string memory, string memory)'
                ],
                signer
            );
            const numHashes = await contract.numHashes();
            const imageHashes = await Promise.all(
                Array(parseInt(numHashes.toString()))
                    .fill(0)
                    .map((_, i) => contract.getImgHash(i))
            );
            setContract(contract);
            setNumHashes(numHashes);
            setImageHashes(imageHashes);
            setImageName(imageHashes.map(([name]) => name));
        })();
    }, []);

    if (!contract) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Uploaded Images</h1>
            <ul>
                {Array(parseInt(numHashes.toString()))
                    .fill(0)
                    .map((_, i) => (
                        <li key={i}>
                            <img
                                src={`https://ipfs.infura.io/ipfs/${imageHashes[i][1]}`}
                                alt={imageName[i]}
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default UploadStorage2;