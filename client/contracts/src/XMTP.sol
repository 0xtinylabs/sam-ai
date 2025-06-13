pragma solidity ^0.8.13;
contract XMTP {

    string public xmtp_address;
    function setBotAddress(string memory bot_address) public {
        xmtp_address = bot_address;
    }

}