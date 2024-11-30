import React, { useState } from "react";
import { ethers } from "ethers";

const Staking = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setWalletAddress(await signer.getAddress());
    } else {
      alert("Install MetaMask to use this feature.");
    }
  };

  return (
    <section className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold">Staking Dashboard</h2>
      {!walletAddress ? (
        <button
          onClick={connectWallet}
          className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mt-4">
          <p>Wallet Connected: {walletAddress}</p>
          <p>Staked Tokens: 0</p>
          <p>Rewards: 0</p>
        </div>
      )}
    </section>
  );
};

export default Staking;
