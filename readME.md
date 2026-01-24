# Discord Weather & AI Bot 🌤️🤖

This is a **personal project** of a Discord bot that provides:

- **Daily weather updates**  
- Weather queries for any city  
- Intelligent AI responses via the **Groq API**  

The bot runs on a **Raspberry Pi 3 B** as a **personal server**, managed with **PM2** to ensure continuous uptime.  

---

## Bot Features

### Weather Commands
- Daily weather updates for Schaerbeek at 08:00 AM  
- Check weather for any city:

```text
!weather [city]
````

* 3-day forecast:

```text
!forecast [city]
```

---

### Utility Commands

* `!ping` → check bot latency
* `!info` → bot information (username, ID, creation date)

---

### NASA Picture of the Day

* `!nasa` → sends NASA’s Picture of the Day (title, image, description)

---

### AI Chat (Groq API)

* Any message **not starting with `!`** is sent to an AI assistant powered by Groq
* Replies are **concise and polite**, limited to 200 tokens
* Handles rate limits with a function that returns:

```text
⏳ Too many requests, please try again later.
```

> The AI is powered by a `askGroqAI` function, which sends the prompt to Groq’s API (specifically the **llama-3.1-8b-instant - on_demand** model) and returns the response.
---

## How the Bot Runs on Raspberry Pi 3 B

This bot runs continuously on a **Raspberry Pi 3 B** with a setup that ensures stability, automatic updates, and controlled power.

---

### SSH Key for GitHub

* A **dedicated SSH key** was generated on the Raspberry Pi to securely pull the private repository from GitHub:
* The public key was added to GitHub under the repository’s **SSH keys** settings.
* This allows the Raspberry Pi to **pull updates automatically**.

---

### PM2 Process Manager

* PM2 keeps the bot **running continuously**
* Automatically restarts the bot if it crashes
* Configured to **auto-start the bot at boot**

```bash
pm2 start npm --name discord-bot -- start --env-file .env
pm2 save
pm2 startup
```

---

### Controlled Power via Smart Plug

* The Raspberry Pi is connected to a **smart plug**
* Exemple of power schedule: **7:00 AM → 8:00 PM**
* Ensures **energy savings** and safe operation when the Pi is powered down
---

### Automatic Updates

* A simple shell script (`update-bot.sh`) could run, on reboot or can be scheduled daily
* Workflow:

1. Pi powers on via smart plug
2. PM2 starts the bot
3. `update-bot.sh` runs: pulls latest code, installs dependencies, builds TypeScript, restarts PM2
4. Bot is live and connected to Discord

---

## 🔹 Technical Notes

* The `.env` file contains **sensitive keys**: Discord token, NASA API key, Groq API key
* TypeScript is compiled directly to **JS files within the `src/` folder**
* AI responses are generated **on-demand** for messages not starting with `!`
* PM2 logs show activity, AI responses, and daily weather updates

---

## Screenshots / Photos 

<img width="659" height="470" alt="image" src="https://github.com/user-attachments/assets/434551c8-a7bc-4ccd-90ac-377b2caa4a7c" />

*Example of the Raspberry Pi 3 B setup used to run the bot*


<img width="1736" height="219" alt="image" src="https://github.com/user-attachments/assets/69ccc4a3-fee4-45d4-9a27-d73a251bae18" />

*PM2 table showing `discord-bot` online*


<img width="679" height="631" alt="image" src="https://github.com/user-attachments/assets/3c23d492-190f-42d1-b4ef-e316ee1d75e2" />

*bot logs showing AI responses and daily weather updates (thanks to PM2)*


<img width="434" height="760" alt="image" src="https://github.com/user-attachments/assets/4f9937c3-df7d-485c-84f1-9d0cc0fac46c" />

*Example of discussion with the bot*

---


## Summary

This project features:
* A **Discord bot with weather + AI functionality**
* Running continuously on a **Raspberry Pi 3 B**
* Secure GitHub access via **SSH key**
* Process management with **PM2**
* Controlled power using a **smart plug**
