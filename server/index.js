import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import "dotenv/config";

const token = process.env.TOKEN;

if (!token) {
  console.error("Xatolik: .env faylida TOKEN topilmadi!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const app = express();

app.use(express.json());
app.use(cors());

const bootstrap = async () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Botni ishga tushirish",
    },
    {
      command: "/courses",
      description: "Kurslarni ko'rish",
    },
  ]);

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

    if (text === "/courses") {
      await bot.sendMessage(
        chatId,
        "Kurslarni ko'rish uchun quyidagi tugmani bosing:",
        {
          reply_markup: {
            inline_keyboard: [
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

app.post("/web-data", async (req, res) => {
  const { queryId, products } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Muvaffaqiyatli xarid qildingiz!",
      input_message_content: {
        message_text: `Siz muvaffaqiyatli xarid qildingiz! Siz tanlagan kurslar: ${products.map((item) => `${item.title} - ${item.quantity} ta`).join(", ")}. Umumiy narx: ${products.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })} qiymatga ega mahsulotlar xarid qildingiz.`,
      },
    });
    return res.status(200).send("Muvaffaqiyatli xarid qildingiz!");
  } catch (error) {
    return res.status(500).send("Server xatosi");
  }
});

app.listen(process.env.PORT || 8000, () => console.log("Server ishga tushdi!"));
