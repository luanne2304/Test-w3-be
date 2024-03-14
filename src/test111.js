const { Web3 } = require('web3');
const Daugia = require('./contracts/Daugiacontract.json')

const init= async()=>{

    const web3 = new Web3 ('HTTP://127.0.0.1:7545')
    const contractAddress = '0x7306A0645c4d7D7B136D9fcAf5Df7DEABeD25774'

    // // Tạo một instance của hợp đồng từ ABI và địa chỉ
    const contractInstance = await new web3.eth.Contract(Daugia.abi, contractAddress);

    const test =await contractInstance.methods.endtime().call()
    
    // const test= await web3.eth.getTransaction("0x7ea8cf8648584956752e043beacd1cebbabcb23a6d1ce0cf6f3a44ce4ff35257")
    console.log(test)
}

init()