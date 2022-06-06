import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import tokenAbi from './utils/MARI.json';

import marie from './assets/marie.png'

import MessageBar from "./MessageBar";
import ConnectWalletButton from "./ConnectWalletButton";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentWaveCount, setWaveCount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState("");
  const [remainingTokens, setRemaining] = useState("");

  const contractAddress = "0x8c169E24aC22dCe86492A432Da4f6A16d36C3278"
  const contractABI = abi.abi;

  const tokenContractAddress = "0x7D8f9a89e8fB4bE4e28e692c1725e046D852675F";
  const tokenContractABI = tokenAbi.abi;

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
      getTokenBalance(currentAccount);

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
  };

  const getTokenBalance = async(addy) => {
    try{
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenContractABI, signer);

        const accounts = await ethereum.request({ method: "eth_accounts"});
        console.log(accounts);

        let _balance = await tokenContract.balanceOf(accounts[0]);
        _balance = await ethers.utils.formatEther(_balance);
        setBalance(_balance);

        const remainingAddress = "0x1ea99548881A770BfEF0E8F544ccF64872095628"
        let _remainingBalance = await tokenContract.balanceOf(remainingAddress)
        _remainingBalance = await ethers.utils.formatEther(_remainingBalance);
        setRemaining(_remainingBalance);
      } else {
        console.log("Ethereum object does not exist!");
      }
    } catch (e) {
      console.log(e);
    }
  };

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
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div style={{ backgroundColor: "Pink", marginTop: "16px", marginBottom: "16px", padding: "10px", "text-align": "center", }}>
        PLEASE ONLY INTERACT WITH RINKEBY TESTNET
        </div>
        <div className="header">
        Give Marie a 👋 and get 1 MARI
        </div>
        <div className="bio">
        Remaining MARI for Claim: {remainingTokens}
        </div>

        <div className="bio">
        MARI token contract: {tokenContractAddress}
        </div>

        <ConnectWalletButton currentAccount = {currentAccount} connectWallet = {connectWallet}/>

        <MessageBar handleChange = {handleChange}/>

        <button className="waveButton" onClick={wave}>
          Wave to Marie
        </button>

        <div className="bio">
          Number Of Waves: {currentWaveCount}
        </div>
        <div className="bio">
          Your MARI balance : {balance} <img className="pic" src={marie} alt=''/>
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
