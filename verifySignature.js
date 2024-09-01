const { ethers } = require("ethers");

// Example function to verify a message signature
async function verifySignature(address, message, signature) {
    const messageHash = ethers.utils.hashMessage(message);
    const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
}

// Example usage
const address = "0x..."; // User address
const message = "Please sign this message to verify your identity.";
const signature = "0x..."; // User signature

verifySignature(address, message, signature).then(isValid => {
    console.log("Signature valid:", isValid);
});
