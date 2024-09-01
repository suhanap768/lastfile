const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = '0x26f11F4B5756CC6ccb89204E08Af2f63EDf52570';
const abi = [ [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "partyName",
				"type": "string"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoterRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "partyName",
				"type": "string"
			}
		],
		"name": "addParty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getParties",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "partyName",
				"type": "string"
			}
		],
		"name": "getVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "parties",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredVoters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "partyName",
				"type": "string"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];
const contract = new web3.eth.Contract(abi, contractAddress);

// Handle registration
document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const voterAddress = document.getElementById('voterAddress').value;
    await contract.methods.registerVoter(voterAddress).send({ from: accounts[0] });
    alert('Voter registered successfully!');
});

// Handle message signing
async function signMessage() {
    const message = document.getElementById('message').value;
    const accounts = await web3.eth.getAccounts();
    const signature = await web3.eth.personal.sign(message, accounts[0]);
    document.getElementById('signature').value = signature;
}

// Handle login
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const signature = document.getElementById('signature').value;
    const accounts = await web3.eth.getAccounts();
    const isValid = await verifySignature(accounts[0], message, signature);
    if (isValid) {
        alert('Login successful!');
        window.location.href = 'final.html';
    } else {
        alert('Invalid signature. Please try again.');
    }
});

// Handle voting
document.getElementById('voteForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const partyName = document.getElementById('partyName').value;
    const accounts = await web3.eth.getAccounts();
    await contract.methods.vote(partyName).send({ from: accounts[0] });
    alert('Vote cast successfully!');
});

// Handle get votes
async function getPartyVotes() {
    const partyName = document.getElementById('partyName').value;
    const votes = await contract.methods.getVotes(partyName).call();
    document.getElementById('results').innerText = `Votes for ${partyName}: ${votes}`;
}

// Function to verify EIP-712 signatures
async function verifySignature(address, message, signature) {
    const messageHash = web3.utils.sha3(message);
    const recoveredAddress = web3.eth.accounts.recover(messageHash, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
}
