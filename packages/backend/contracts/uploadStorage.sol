pragma solidity ^0.8.0;

contract uploadStorage {

    uint256 id;
    string hash;

    struct Uploads {
        uint256 id;
        string hash;
    }

    Uploads[] public upload;

    mapping(uint256 => string) public hashToId;

    function store(uint256 _id) public {
        id = _id;
    }

    function retrieve() public view returns(string memory) {
        return hash;
    }

    function addUpload(uint256 _id, string memory _hash) public {
        upload.push(Uploads(_id, _hash));
        hashToId[_id] = _hash;
    }

}
