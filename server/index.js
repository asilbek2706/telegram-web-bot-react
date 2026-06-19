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
  await bot.setMyCommands([
    { command: "/start", description: "Botni ishga tushirish" },
    { command: "/courses", description: "Kurslarni ko'rish" },
  ]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
      return await bot.sendMessage(
        chatId,
        `Assalomu alaykum, ${msg.from?.first_name || "Foydalanuvchi"}!`,
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
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        },
      );
    }

    if (text === "/courses") {
      return await bot.sendMessage(
        chatId,
        "Kurslarni ko'rish uchun quyidagi tugmani bosing:",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Kurslarni ochish",
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
        const data = JSON.parse(msg.web_app_data.data);
        const products = data.products || data;

        if (!Array.isArray(products)) return;

        await bot.sendMessage(
          chatId,
          "Bizning kursimizni tanlaganingiz uchun rahmat! Tanlangan kurslar:",
        );

        let totalSum = 0;
        for (let item of products) {
          totalSum += item.price * item.quantity;
          if (item.Image) {
            await bot.sendPhoto(chatId, item.Image, {
              caption: `${item.title} - ${item.quantity} ta`,
            });
          } else {
            await bot.sendMessage(
              chatId,
              `${item.title} - ${item.quantity} ta`,
            );
          }
        }

        await bot.sendMessage(
          chatId,
          `Umumiy narx: ${totalSum.toLocaleString({
            "en-US": "USD",
          })} USD`,
        );
      } catch (error) {
        console.error("WebAppData formatlashda xatolik:", error);
        await bot.sendMessage(
          chatId,
          "Ma'lumotni qayta ishlashda xatolik yuz berdi.",
        );
      }
    }
  });
};

bootstrap();

app.post("/web-data", async (req, res) => {
  const { queryId, products } = req.body;

  if (!queryId || !products || !Array.isArray(products)) {
    return res.status(400).send("Noto'g'ri ma'lumot yuborildi");
  }

  try {
    const totalSum = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const productText = products
      .map((item) => `${item.title} (${item.quantity} ta)`)
      .join(", ");

    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Muvaffaqiyatli xarid qildingiz!",
      input_message_content: {
        message_text: `Siz muvaffaqiyatli xarid qildingiz!\n\nKurslar: ${productText}\nUmumiy narx: ${totalSum.toLocaleString()} USD`,
      },
    });

    return res.status(200).send("Muvaffaqiyatli xarid qildingiz!");
  } catch (error) {
    console.error("answerWebAppQuery xatoligi:", error);
    return res.status(500).send("Server xatosi yoki queryId eskirgan");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishga tushdi!`));
