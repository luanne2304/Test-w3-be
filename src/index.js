
const express = require('express')
const cors = require('cors')
const mongoose =require('mongoose')
const morgan =require('morgan')
const sanpham = require('../model/sanpham')
const transaction = require('../model/transaction')
const { Web3 } = require('web3');
const Daugia = require('./contracts/Daugiacontract.json')

const app = express()
const port = 5000
const uri='mongodb+srv://luannee23044:L01223645490z!@luannee23044.0shefdc.mongodb.net/TestNRM'

//khai bao web3
const web3 = new Web3 ('HTTP://127.0.0.1:7545')
const contractAddress = '0x7306A0645c4d7D7B136D9fcAf5Df7DEABeD25774'

// Tạo một instance của hợp đồng từ ABI và địa chỉ
const contractInstance = new web3.eth.Contract(Daugia.abi, contractAddress);


app.use(morgan('combined'))

app.use(express.json());

app.use(express.urlencoded())

app.use(cors())


// const corsOptions = {
//   origin: "http://localhost:5000/", // Đổi thành domain của ứng dụng web frontend của bạn
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// };

// app.use(cors(corsOptions));


app.get("/12", async (req, res) => {
  try {
    const sp = await sanpham.find({});
    console.log("aaa");
    res.status(200).json({
      message:"OKELA",
      data:sp
    }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/posttrans", async (req, res) => {
  try {
    const { From, To, Gasused, Value, Transactionhash } = req.body;
    const newTransaction = new transaction({
      From: From,
      To: To,
      Gasused: Gasused,
      Value: Value,
      TransactionHash: Transactionhash
    });
    await newTransaction.save();
    res.status(200).json({ message: "OK" });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/getTransbyID", async (req, res) => {
  try {
    const address =req.query.Address;
    const transs = await transaction.find({
      $or: [
        { From: address.toLowerCase() },
        { To: address.toLowerCase() }
    ]
               
    });
  const transhashs = transs.map(transaction => transaction.TransactionHash);
    res.status(200).json({
      message:"OKELA",
      return:transhashs
    }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/daugia", async (req, res) => {
  try {
    const { From,  Value} = req.body;
    const result= await contractInstance.methods.bid().send({
      from: From,
      value: web3.utils.toWei(Value,'ether')
    })
    
    res.status(200).json({ message: "OK", data: result.transactionHash });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/rutve", async (req, res) => {
  try {
    const { From } = req.body;
    const result= await contractInstance.methods.withdraw().call({
      from: From,
    })
    console.log(result);
    res.status(200).json({ message: "OK", data: result.transactionHash });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/ketthucphien", async (req, res) => {
  try {
    const { From } = req.body;
    const result= await contractInstance.methods.sessionEnd().send({  
      from: From,
    })
    console.log(result);
    res.status(200).json({ message: "OK", data: result.transactionHash });
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect(uri)
  .then(()=>{
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
    
  })
  .catch((error)=>{
    console.log(error)
  })

