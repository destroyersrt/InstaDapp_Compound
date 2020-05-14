require('dotenv').config()


const Web3 = require('Web3')
const DSA = require('dsa-sdk')

//	Instantiation of web3 object 
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ETH_NODE_URL))


// Instantiation of DSA
const dsa = new DSA ({
	web3,
	mode: "node",
	privateKey: process.env.PRIVATE_KEY
})

// Instantiation of spells

let spells = dsa.Spell()

/* 
	
	BUILD FUNCTIONALITY

	async function getTxnCount() {
  		return await web3.eth.getTransactionCount(process.env.PUBLIC_ADDRESS);
	}

	async function buildWallet() {
	  const nonce = await getTxnCount();
	  dsa.build({
	    gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei')),
	    gasLimit: web3.utils.toHex(gasLimit),
	    nonce: nonce
	  }).then(txHash => {
	    console.log(`https://etherscan.io/tx/${txHash}`)
	  })
	}

*/


const gasLimit = "2000000"
const gasPrice = "20";

var accounts;


// Adding both the spells
spells.add({
	connector: "compound",
	method: "deposit",
	args: [dsa.tokens.info.eth.address,dsa.tokens.fromDecimal(0.01,"eth") , 0, 0]
})

spells.add({
	connector: "compound",
	method: "withdraw",
	args: [dsa.tokens.info.eth.address,dsa.tokens.fromDecimal(0.01,"eth") , 0, 0]
})


//	 Get and Set Account functionalities
async function setAccount(callback) {

	accounts = await dsa.getAccounts(process.env.PUBLIC_ADDRESS)
	console.log(accounts)

	const set = await dsa.setAccount({
		"id" : accounts[0].id,
		"address": accounts[0].address,
		"version": '1',
		"origin": process.env.PUBLIC_ADDRESS 
	})
	console.log ('Account has been set !!!')

	return callback()
	
}

//	TRANSFER FUNCTIONALITY 

function transfer(callback) {
	dsa.transfer({
	    "token": "eth",
	    "amount": dsa.tokens.fromDecimal(0.001, "eth"),
	    "gas": web3.utils.toHex(gasLimit),
	    "gasPrice": web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei'))
	}).then(data  => {
	    return  callback(undefined,data)  // transaction hash
	}).catch(error  => {
	    return  callback(error,undefined)
	})
}

setAccount(()=> {
	transfer((err,data)=> {
		if(err) {
			console.log(err)
		} else {
			dsa.cast({
				spells,
				'gasPrice': web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei')),
				'gas': web3.utils.toHex(gasLimit),
				'nonce': '10'

			}).then(console.log)
		}
	})
})







