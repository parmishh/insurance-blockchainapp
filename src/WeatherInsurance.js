import { useEffect, useState } from "react";
import {
  weatherInsuranceContract,
  connectWallet,
  buyInsurance,
  updateTemperature,
} from "./util/interact.js";

const { ethers } = require("ethers");

const WeatherInsurance = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [temperature, setTemperature] = useState(""); //default message
  const [premiumInEthers, setPremiumInEthers] = useState("");

  //called only once
  useEffect(() => {
    getCurrentWalletConnected();
    addSmartContractListener();
    addWalletListener();
  }, []);

  async function addSmartContractListener() {
    weatherInsuranceContract.on("SettlementPaid", (amount, to, data, _) => {
      const value = ethers.utils.formatEther(amount);
      const message = "💰 Settlement paid: " + value + " ETH to " + to;

      console.log("Settlement paid: %s ETH to ", value, to);
      setStatus(message);
    });
  }



 

  async function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Transactions");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            
          </a>
        </p>
      );
    }
  }

  async function getCurrentWalletConnected() {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          setWallet(addressArray[0]);
          setStatus("Transactions");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button..");
        }
      } catch (err) {
        setWallet("");
        setStatus("⛔ " + err.message);
      }
    } else {
      setWallet("");
      setStatus(
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
             
            </a>
          </p>
        </span>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };



  

  const onBuyInsurancePressed = async () => {
    const { status } = await buyInsurance(walletAddress, premiumInEthers);
    setStatus(status);
  };

  const textt="Claim Request sent to insurance company reason:"+ {temperature};

  const onUpdateTemperaturePressed = async () => {
    const { status } = await updateTemperature(walletAddress, temperature);
    setStatus(status);
  };

  //the UI of our component
  return (
    <div id="container">
      
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h1 style={{ marginTop: "50px" }}></h1>
      <h2><img src="favicon.png"></img>Our Idea</h2>

      
      <p>
        You pay an insurance with the monthly premium and its data is stored in blockchain which is immutable and keeps you safe from corruption
      </p>
      <p>
        You can make a Insurance claim incase you want with a Brief reason it will be sent to the Insurance company for review and they will reach out to you further process
      </p>

      <div className="flexbox-container">
        <div className="input-button">
          <h2>Pay Your Insurances</h2>
          <h3>Specify monthly premium of the insurance in ETH:</h3>
          <div>
            <input
              type="text"
              placeholder="Value in Ethers"
              onChange={(e) => setPremiumInEthers(e.target.value)}
              value={premiumInEthers}
            />

            <button id="buyInsurance" onClick={onBuyInsurancePressed}>
              Pay Your Insurances
            </button>
          </div>
        </div>

        <div className="input-button">
          <h2>Claim Insurance</h2>
          <h3>Specify the reason of claim in brief Below we will reach out to you:</h3>
          <div>
            <input
              type="text"
              placeholder="Reason for insurance claim"
              onChange={(e) => setTemperature(e.target.value)}
              value={temperature}
            />

            <button id="updateTemperature" onClick={() => alert("Claim Request sent to insurance company:: your stated reason:"+ temperature)}>
              Request Claim
            </button>
          </div>
        </div>
      </div>
      

      <div style={{ marginTop: "20px" }}>
        <h2>Status:</h2>
        <div id="status">{status}</div>
      </div>
    </div>
  );
};

export default WeatherInsurance;
