import * as dotenv from 'dotenv';
dotenv.config();

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";

const myPrivateKey: string = <string>process.env.MY_PRIVATE_KEY;
const cronosApiKeyMainnet: string = <string>(
    process.env.CRONOS_EXPLORER_MAINNET_API_KEY
);
const cronosApiKeyTestnet: string = <string>(
    process.env.CRONOS_EXPLORER_TESTNET_API_KEY
);

task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    networks: {
        cronos: {
            url: "https://evm.cronos.org/",
            chainId: 25,
            accounts: [myPrivateKey],
            gasPrice: 10100000000000,
        },
        cronosTestnet: {
            url: "https://evm-t3.cronos.org/",
            chainId: 338,
            accounts: [myPrivateKey],
            gasPrice: 10100000000000,
        },
    },
    etherscan: {
        apiKey: {
            cronos: cronosApiKeyMainnet,
            cronosTestnet: cronosApiKeyTestnet,
        },
        customChains: [
            {
                network: "cronos",
                chainId: 25,
                urls: {
                    apiURL:
                        "https://explorer-api.cronos.org/mainnet/api/v1/hardhat/contract?apikey=" +
                        cronosApiKeyMainnet,
                    browserURL: "https://explorer.cronos.org",
                },
            },
            {
                network: "cronosTestnet",
                chainId: 338,
                urls: {
                    apiURL:
                        "https://explorer-api.cronos.org/testnet/api/v1/hardhat/contract?apikey=" +
                        cronosApiKeyTestnet,
                    browserURL: "https://explorer.cronos.org/testnet",
                },
            },
        ],
    },
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    gasReporter: {
        currency: "USD",
        gasPrice: 5000, // In GWei
        coinmarketcap: process.env.COINMARKETCAP_API || "",
    },
    sourcify: { // plug-in tool used for verifying and publishing smart contract source code on block explorers
        enabled: false,
    },
};

export default config;
