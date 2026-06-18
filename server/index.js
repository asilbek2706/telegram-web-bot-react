import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const token = process.env.TOKEN;

if (!token) {
  console.error("Xatolik: .env faylida TOKEN topilmadi!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const bootstrap = async () => {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendMessage(
        chatId,
        `Assalomu alaykum, ${msg.from.first_name}!`,
      );
    }
  });
};

bootstrap();
