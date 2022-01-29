const contract_address = "YOUR_CONTRACT_ADDRESS"
const contract_ABI = [] //YOUR CONTRACT ABI
const infura_socker_server = "YOUR INFURA WSS SERVER "

const web3_socket = new Web3(
  new Web3.providers.WebsocketProvider(
    infura_socker_server
  )
)
const MyContract_socket = web3_socket.eth.Contract(
  contract_ABI,
  contract_address
)
var web3 = new Web3(window.ethereum)
var MyContract = web3.eth.Contract(contract_ABI, contract_address)

$(document).ready(function () {
  var currentAccount = null
  check_Metamask()

  $("#btn_deposit").click(function () {
    var name = $("#name").val()
    var amount = $("#deposit_amount").val()
    MyContract.methods
      .deposit(name)
      .send({
        from: currentAccount,
        value: web3.utils.toWei(amount, "ether")
      })
      .on("NewDepositCome", (eventData) => {
        console.log("eventData", eventData)
      })
  })
  $("#btn_connect_MM").click(function () {
    connect_Metamask().then((data) => {
      currentAccount = data[0]
      $("#address").html(currentAccount)
      web3.eth.getBalance(currentAccount).then(function (balance) {
        $("#balance").html(
          parseFloat(web3.utils.fromWei(balance, "ether")).toFixed(2)
        )
      })
    })
  })

  MyContract_socket.events.NewDepositCome({}, (error, data) => {
    appendNewMember([
      data.returnValues[2],
      data.returnValues[0],
      data.returnValues[1],
    ])
  })

  MyContract.methods
    .getMemberLength()
    .call()
    .then((data) => {
      var members_count = web3.utils.hexToNumber(data)
      for (var i = 0; i < members_count; i++) {
        MyContract.methods
          .getMember(i)
          .call()
          .then((data) => {
            appendNewMember(data)
          })
      }
    })
})

async function connect_Metamask() {
  const accounts = ethereum.request({ method: "eth_requestAccounts" })
  return accounts
}

function appendNewMember(data) {
  $("#members").append(
    `
            <tr>
              <td>` +
      data[0] +
      `</td>
              <td>` +
      data[1] +
      `</td>
              <td>` +
      web3.utils.fromWei(web3.utils.toBN(data[2]), "ether") +
      `</td>
            </tr>`
  )
}

function check_Metamask() {
  if (typeof window.ethereum !== "undefined") {
    $("#header").show()
    $("#installMM").hide()
  } else {
    $("#header").hide()
    $("#installMM").show()
  }
}
