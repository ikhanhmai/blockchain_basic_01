var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/scripts", express.static(__dirname + "/node_modules/web3.js-browser/build/"));

var fs = require("fs");
var server = require("http").Server(app);
require("socket.io")(server);
var port = 3000;

var Web3 = require("web3")
const contract_address = "YOUR_CONTRACT_ADDRESS"
const contract_ABI = [] //YOUR CONTRACT ABI
const infura_socker_server = "YOUR INFURA WSS SERVER "

const web3_socket = new Web3(
  new Web3.providers.WebsocketProvider(
    infura_socker_server
  )
)
const MyContract_socket = new web3_socket.eth.Contract(
  contract_ABI,
  contract_address
)

//LISTENING CONTRACT EVENT FROM SERVER SIDE
MyContract_socket.events.NewDepositCome({}, (error, data) => {
  console.log('NewDepositCome', data)
})


server.listen(port,() => {
   console.log(`App is running at port: ${port}`);
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

fs.readFile("./config.json", "utf8", function(err, data){
    if(err){ throw err };
    var obj = JSON.parse(data);
    require("./routes/main")(app, obj);
});