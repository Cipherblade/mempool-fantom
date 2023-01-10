// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// Monitoring Ftm node
const hre = require("hardhat");
const ethers = hre.ethers;
var Big = require('bn.js');
const assert = require('assert');

// Telegram bot
const express = require('express')
const expressApp = express()
const axios = require("axios");
const path = require("path")
const port = process.env.PORT || 3000;
expressApp.use(express.static('static'))
expressApp.use(express.json());
require('dotenv').config();
const { Telegraf } = require('telegraf');
// The API token of the specific bot (hardcoded inside the .ENV file)
const bot = new Telegraf(process.env.BOT_TOKEN);
// The hardcoded chat ID of the Telegram private group. The bot only posts to that specific group.
const chatId = "-725982435" 

// Listen to commands. This is to test the bot works.
expressApp.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
  });

  // Listen to commands. This is to test the bot works.
  bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! I\'m working fine. '+ctx.chat.id+'.\nI respond to /ethereum. Please try it', {
    })
  })

  // Listen to commands. This is to test the bot works.
  bot.command('ethereum', ctx => {
    var rate;
    console.log(ctx.from)
    axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
    .then(response => {
      console.log(response.data)
      rate = response.data.ethereum
      const message = `Hello, today the ethereum price is ${rate.usd}USD`
      bot.telegram.sendMessage(ctx.chat.id, message, {
      })
    })
  })

// Initiate the polling (actively listening to commands).
bot.launch()

//const wssUrl = "ws://10.0.0.8:5151";

// This is a public Fantom node 
const wssUrl = "wss://wsapi.fantom.network/";

// The hardcoded address the bot is monitoring. The initial 0x should be removed so that it includes txs related to the address inside the transaction data.
const monitored = "8AeeaBD8bD2A7bcCB73D14d72b49e7341c9383B3"
//const monitored = "04068da6c83afcfa0e13ba15a6696662335d5b75" // testing USDC contract.

// The main loop. This is the neverending loop the bot is going to execute to provide monitoring services.
async function main() {
    // The hardhat provider uses the websocket connection to the public node.
    const provider = new ethers.providers.WebSocketProvider(wssUrl);

    // The bot is lisening to pending transactions on the mempool.
    provider.on('pending', async (tx) => {
        const txnData = await provider.getTransaction(tx);

        // The bot should send a message when there is a transaction
        if (txnData) {            
            let gas = txnData['gasPrice'];
            if (txnData.to == "0x"+monitored || txnData.from == "0x"+monitored || txnData['data'].includes(monitored)) {
                console.log("hash: ", txnData['hash']);

                // The message sent to the group with chatId (hardcoded)
                bot.telegram.sendMessage(chatId, "Monitoring: 0x"+monitored+"\nMempool alert: \n<a href='https://ftmscan.com/tx/"+txnData['hash']+"'>"+txnData['hash']+"</a>", {parse_mode: 'HTML'})
            }
        } 
    })
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});