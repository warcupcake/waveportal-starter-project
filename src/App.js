import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

import MessageBar from "./MessageBar";
import ConnectWalletButton from "./ConnectWalletButton";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentWaveCount, setWaveCount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0x52798353c8986719697f1824bD2bB029f9E0bAaA"
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
     try {

      const {ethereum} = window;

      if (!ethereum) {
        console.log("Please install metamask");
      } else {
        console.log("Ethereum object detected");
      }

      const accounts = await ethereum.request({ method: "eth_accounts"});

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Authorized account: ${account}`);
        setCurrentAccount(account);

      } else {
        console.log("No authorized account found");
      }

      getTotalWaves();
      getAllWaves();

    } catch (error) {
      console.log(error);
    }
  }

const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

const getTotalWaves = async () => {
  try{
    const {ethereum} = window;

    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...:", count.toNumber());
      setWaveCount(count.toNumber());

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch(error) {
    console.log(error);
  }
}

const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          }
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try{
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined...", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setWaveCount(count.toNumber());

        getAllWaves();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <ConnectWalletButton currentAccount = {currentAccount} connectWallet = {connectWallet}/>

        <MessageBar handleChange = {handleChange}/>

        <button className="waveButton" onClick={wave}>
          Trigger The Wave
        </button>

        <div className="bio">
          Number Of Waves: {currentWaveCount}
        </div>

        <div>
          {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
            );
        })}
        </div>
        
      </div>
    </div>
  );
}
