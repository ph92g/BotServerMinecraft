const mineflayer = require('mineflayer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const accounts = require('./accounts.json');

// Khoan va chạm API Key trực tiếp trong code nếu có thể; hãy đảm bảo giữ bí mật API key của bạn
const genAI = new GoogleGenerativeAI("yourapikey");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const registeredBots = new Set();

const COMMON_KEYWORDS = [
    "alo", "chao", "hi", "hello", "giup", "voi", "sao", "dau", "ai", 
    "lam gi", "choi", "di đâu", "ngu", "ga", "bro", "pro", "ong", "ban"
];

function isContextuallyRelevant(message) {
    const cleanMsg = message.toLowerCase();
    return COMMON_KEYWORDS.some(keyword => cleanMsg.includes(keyword)) || cleanMsg.includes("?");
}

function startBot(acc) {
    const chatHistory = [];
    let lastResponseTime = 0;
    const RESPONSE_COOLDOWN_MS = 8000;

    const bot = mineflayer.createBot({
        host: 'serverip',
        port: 0,
        username: acc.username,
        version: false,
        checkTimeoutInterval: 60000
    });

    bot.on('spawn', () => {
        console.log(`[${acc.username}] Da vao game, san sang...`);
    });

    bot.on('message', (jsonMsg) => {
        const msg = jsonMsg.toString().toLowerCase();
        
        if (registeredBots.has(acc.username)) return;

        if (msg.includes("register") && msg.includes("password")) {
            console.log(`[${acc.username}] Phat hien yeu cau register, dang dang ky...`);
            bot.chat(`/register 1010101012 1010101012`);
            registeredBots.add(acc.username);
            setTimeout(() => registeredBots.delete(acc.username), 10000);
        }
        
        if (msg.includes("login") || msg.includes("dang nhap")) {
            console.log(`[${acc.username}] Phat hien yeu cau login, dang nhap...`);
            bot.chat(`/login ${acc.password}`);
        }
    });

    bot.on('chat', async (username, message) => {
        if (username === bot.username) return;

        chatHistory.push(`${username}: ${message}`);
        if (chatHistory.length > 8) {
            chatHistory.shift();
        }

        const now = Date.now();
        if (now - lastResponseTime < RESPONSE_COOLDOWN_MS) return;

        const lowerMsg = message.toLowerCase();
        const lowerBotName = bot.username.toLowerCase();

        const isDirectMention = lowerMsg.includes("bot") || lowerMsg.includes(lowerBotName);
        
        let isNearbyPlayerTalking = false;
        const playerEntity = bot.players[username]?.entity;
        if (playerEntity && playerEntity.position && bot.entity && bot.entity.position) {
            const distance = bot.entity.position.distanceTo(playerEntity.position);
            if (distance <= 5) {
                isNearbyPlayerTalking = true;
            }
        }

        const isRelevant = isContextuallyRelevant(message);

        let shouldRespond = false;
        if (isDirectMention) {
            shouldRespond = Math.random() < 0.85;
        } else if (isNearbyPlayerTalking && isRelevant) {
            shouldRespond = Math.random() < 0.40;
        } else if (isRelevant) {
            shouldRespond = Math.random() < 0.15;
        }

        if (shouldRespond) {
            lastResponseTime = now;
            const delay = Math.floor(Math.random() * 3000) + 2500;

            setTimeout(async () => {
                try {
                    const recentContext = chatHistory.join("\n");
                    const promptAI = `Ban la mot gamer Viet Nam dang choi Minecraft, tên trong game la ${bot.username}.
Quy tac ung xư:
- KHONG BAO GIO thua nhan minh la AI, bot, hay chuong trinh may tinh.
- Tra loi cuc ky ngan gon (duoi 10 tu), khong viet hoa dau cau, khong dung dau cau cau ky.
- Dung ngõng ngu/slang game thu Viet Nam (vd: vcl, ak, tr, loi, ga, ok, k, t, m, lm gi, sao the...).
- Neu ai nghi ngo la bot hoac hoi "phai bot khong", hay phu nhan gắt gao hoac chui/thach thuc lai kieu gắt gao cua game thu.
- Dua vao nhat ky chat gan hay de tra loi dung ngu canh.

Lich su chat gan hay:
${recentContext}

Cau hoi/tin nhan moi nhat tu ${username}: "${message}"
Phan hoi cua ban:`;

                    const result = await model.generateContent(promptAI);
                    let replyText = result.response.text().trim().toLowerCase();
                    replyText = replyText.replace(/[\n\r]/g, ' ');

                    if (replyText) {
                        bot.chat(replyText);
                        chatHistory.push(`${bot.username}: ${replyText}`);
                    }
                } catch (err) {
                    console.log(`Loi AI ${acc.username}: ${err.message}`);
                }
            }, delay);
        }
    });

    bot.on('physicTick', () => {
        if (Math.random() < 0.0001) {
            bot.look(bot.entity.yaw + (Math.random() - 0.5) * 2, bot.entity.pitch);
        }
    });

    bot.on('end', (reason) => {
        console.log(`[${acc.username}] Ngat ket noi: ${reason}. Thu lai sau 30s.`);
        registeredBots.delete(acc.username);
        setTimeout(() => startBot(acc), 30000);
    });

    bot.on('error', (err) => console.log(`Loi ${acc.username}: ${err.message}`));
}

accounts.forEach((acc, index) => {
    setTimeout(() => startBot(acc), index * 10000);
});