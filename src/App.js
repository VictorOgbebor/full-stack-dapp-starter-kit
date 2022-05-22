import { ethers } from "ethers";
import { useState } from "react"
import "./App.css"
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import Token from "./artifacts/contracts/Token.sol/Token.json"

const greeterAddress = "0xBDC0aCE585b7b30cf60b07C4669bAbaD45374036"
const tokenAddress = "0x45aDFEbee67208E93d8921c0d6478EfEEa639D17"


function App()
{
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  // connect to metamask
  async function requestAccount(params) {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // Calls data
  async function fetchGreeting(params) {
    if (typeof window.ethereum !== "undefined")
    {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try
      {
        const data = await contract.greet()
        console.log("data: ", data)
      } catch (err)
      {
        console.log("Error: ", err)
      }
      
    }
  }

  async function getBalance(params) {
    if (typeof window.ethereum !== "undefined")
    {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
 
      const balance = await contract.balanceOf(account)
      console.log("Balance: ", balance.toString())
      
    }
  }

  // does actions
  async function setGreeting(params) {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)  
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function sendCoins(params) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  return (
    <div className="App">
      <h1>BlockchainBic Starter-Dapp</h1>
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Message</button>
        <button onClick={setGreeting}>Set Message</button>
        <input
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Set Message"
          value={greeting}
        />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
