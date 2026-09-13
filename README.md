# BotServerMinecraft
A lightweight multi-account Minecraft bot powered by Mineflayer and Google Gemini AI, featuring automatic authentication, contextual Vietnamese chat responses, randomized behavior, and automatic reconnection.
Minecraft AI Bot

A lightweight multi-account Minecraft bot built with Node.js, Mineflayer, and Google Gemini AI.

The bot is designed for a Minecraft server where multiple accounts can stay online, automatically handle /register and /login, monitor player chat, and respond naturally using an AI-powered Vietnamese gamer persona.

✨ Features

🤖 Multiple Minecraft accounts

Load multiple bot accounts from accounts.json.

Bots start with a configurable delay between accounts to avoid connecting all at once.

💬 AI-powered Vietnamese chat

Uses Google Gemini to generate short, contextual responses.

Keeps recent chat history for better conversational context.

Uses different response probabilities depending on whether the bot is mentioned, nearby, or the message appears relevant.

🔐 Automatic authentication

Detects server messages requesting /register.

Automatically sends /register.

Detects login prompts and sends the account password with /login.

🔄 Automatic reconnection

If a bot is disconnected, it automatically attempts to reconnect after 30 seconds.

🧠 Context-aware responses

Direct mentions of the bot receive a high response probability.

Nearby conversations are more likely to trigger a response.

General relevant chat has a lower probability, making the bots less spammy.

🎮 Lightweight idle behavior

Includes occasional random head movement so bots are not completely static.

🛠️ Tech Stack

Node.js — Runtime

Mineflayer — Minecraft bot framework

Google Generative AI — Gemini API integration

JSON — Account configuration

Windows .bat scripts — Easy start/stop management

📁 Project Structure

Bot/
├── index.js
├── accounts.json
├── package.json
├── package-lock.json
├── ChayBot.bat
└── TatBot.bat

index.js

Main bot controller.

Responsible for:

Connecting to the Minecraft server

Managing multiple bot accounts

Handling authentication

Reading player chat

Generating Gemini responses

Reconnecting disconnected bots

Basic idle behavior

accounts.json

Stores the Minecraft accounts used by the bot.

Example:

[
  {
    "username": "BotAccount1",
    "password": "your-password"
  },
  {
    "username": "BotAccount2",
    "password": "your-password"
  }
]

Security: Never commit real Minecraft passwords or API keys to a public GitHub repository. Use environment variables or another secure configuration method for production.

ChayBot.bat

Windows launcher that:

Changes the working directory to the bot folder.

Installs required npm packages.

Starts index.js.

TatBot.bat

Stops running Node.js processes on Windows.

This uses taskkill /f /im node.exe, so it will terminate all Node.js processes, not only this bot.

🚀 Installation

Requirements

Node.js 22+

A Minecraft Java Edition server

Minecraft accounts that can join the server

A Google Gemini API key

The current Mineflayer dependency requires a modern Node.js runtime.

1. Clone the repository

git clone https://github.com/your-username/your-repository.git
cd your-repository/Bot

2. Install dependencies

npm install

3. Configure accounts

Edit:

accounts.json

Example:

[
  {
    "username": "BotAccount1",
    "password": "password1"
  },
  {
    "username": "BotAccount2",
    "password": "password2"
  }
]

4. Configure the Minecraft server

Open index.js and configure the server connection:

const bot = mineflayer.createBot({
    host: 'your-server-ip',
    port: 25565,
    username: acc.username,
    version: false
});

5. Configure Gemini

The project uses Google Gemini through:

const { GoogleGenerativeAI } = require("@google/generative-ai");

Create a Gemini API key and configure it securely.

For local testing, the current project structure can be adapted to use an environment variable:

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

Then set the key before starting the bot.

Windows CMD:

set GEMINI_API_KEY=YOUR_API_KEY
node index.js

PowerShell:

$env:GEMINI_API_KEY="YOUR_API_KEY"
node index.js

▶️ Running the Bot

Windows

Double-click:

ChayBot.bat

Or run:

node index.js

To stop the bot:

TatBot.bat

Or press:

Ctrl + C

🧠 AI Behavior

The bot is intentionally configured to behave like a casual Vietnamese Minecraft player rather than producing long AI-style messages.

The response system considers:

Situation

Approx. Response Chance

Bot is directly mentioned

85%

Nearby player + relevant message

40%

Relevant general message

15%

Irrelevant message

Usually ignored

There is also an 8-second response cooldown per bot and a randomized 2.5–5.5 second typing delay before sending an AI response.

The bot maintains the latest eight chat entries as conversational context.

🔐 Authentication Flow

When the server sends a message indicating that registration is required, the bot attempts:

/register <password> <password>

When a login prompt is detected, it attempts:

/login <account-password>

Make sure this behavior matches the authentication plugin and rules used by your server.

🔄 Reconnection

If a bot loses connection:

Bot disconnected
        ↓
Wait 30 seconds
        ↓
Reconnect
        ↓
Return to normal operation

This allows the bot group to recover automatically from temporary network or server interruptions.

⚙️ Customization

You can customize several parts of the bot directly in index.js.

Response cooldown

const RESPONSE_COOLDOWN_MS = 8000;

Nearby detection distance

if (distance <= 5) {
    isNearbyPlayerTalking = true;
}

Bot startup interval

Bots currently start 10 seconds apart:

setTimeout(() => startBot(acc), index * 10000);

Reconnect delay

Bots currently reconnect after 30 seconds:

setTimeout(() => startBot(acc), 30000);

Chat keywords

Relevant messages are detected using:

const COMMON_KEYWORDS = [
    "alo", "chao", "hi", "hello", "giup", "voi",
    "sao", "dau", "ai", "lam gi", "choi"
];

These can be expanded depending on the server's community and language.

⚠️ Security & Privacy

Do not upload secrets to GitHub.

At minimum, keep these values private:

Minecraft account passwords

Gemini API keys

Private server addresses if they are intended to remain private

Any authentication credentials

Recommended production setup:

.env

GEMINI_API_KEY=your_api_key

And add:

.env
accounts.json

to .gitignore if they contain real credentials.

📜 License

This project currently does not specify a formal open-source license.

If you intend to publish or distribute the source code, add a license such as MIT, Apache-2.0, or another license that matches your intended usage.

👤 Author

PH92G

Minecraft bot / automation project built for server-side gameplay assistance and experimentation.

⭐ Notes

This project is intended for servers where bot accounts and automation are permitted.

Always check the rules of the Minecraft server before running multiple automated accounts.
