# Sample Hardhat Project

A simplistic Fantom Opera tracking bot.

This bot has been designed to respond to the minimal requirements for monitoring of a specific case.

The Telegram bot listen to the /start and /ethereum commands and post a reply message. This is only to test the bot is working.

The js file to start this bot is at scripts/mempool.js

The address to monitor and the bot token are hardcoded.

The bot purpose is to monitor a single address and publish any transaction mentioning that address, either as from, to, or inside the transaction data to a specific chat ID.

The chat ID is hardcoded too at mempool.js.