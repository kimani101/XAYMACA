import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts/src",
    tests: {
      solidity: "./contracts/test",
      nodejs: "./contracts/test-node",
    },
    cache: "./contracts/cache",
    artifacts: "./contracts/artifacts",
  },
  test: {
    solidity: {
      fuzz: { runs: 256 },
    },
  },
});
