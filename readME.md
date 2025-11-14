# Discord Weather Bot 🌤️

Discord Weather Bot is a Node.js bot for sending daily weather updates and checking the current weather for any city on Discord.

## 💾 Installation

Use [npm](https://www.npmjs.com/) to install dependencies:

```bash
git clone https://github.com/votre-utilisateur/discord-weather-bot.git
cd discord-weather-bot
npm install
```
Create a .env file with your Discord bot token and user ID:
```bash
TOKEN=YOUR_DISCORD_BOT_TOKEN
USER_ID=YOUR_USER_ID
```


## 🌟 Features

Daily automatic weather updates for Schaerbeek

Weather lookup for any city with !weather [city]

Ping command to check latency (!ping)

Bot information command (!info)

## 📖 Usage
```bash
npm run start
```
## Example commands on Discord:

```bash
!weather Schaerbeek   # Get current weather in Schaerbeek
!weather Paris        # Get current weather in Paris
!ping                 # Check bot latency
!info                 # Display bot information
```

The bot also automatically sends daily weather updates for Schaerbeek at 08:00 AM.
