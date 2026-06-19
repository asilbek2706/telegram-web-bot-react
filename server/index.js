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
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text: "Kurslarni ko'rish",
                  web_app: {
                    url: "https://telegram-web-bot-two-rouge.vercel.app",
                  },
                },
              ],
            ],
          },
        },
      );
    }

    if (msg.web_app_data?.data) {
      try {
        const data = JSON.parse(msg.web_app_data?.data);

        await bot.sendMessage(
          chatId,
          "Bizning kursimizni tanlaganingiz uchun rahmat! Siz tanlagan kurslar: ",
        );

        for (let item of data) {
          await bot.sendPhoto(chatId, item.Image);
          await bot.sendMessage(chatId, `${item.title} - ${item.quantity} ta`);
        }

        await bot.sendMessage(
          chatId,
          `Umumiy narx: ${data.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })} so'm`,
        );
      } catch (error) {
        console.error("Xatolik yuzaga keldi:", error);
      }
    }
  });
};

bootstrap();
