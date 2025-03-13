const express = require("express");
const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const { upload } = require("./mega.js");
const pino = require("pino");

const router = express.Router();

// Language detection function
function detectLanguage(text) {
  const sinhalaRegex = /[\u0D80-\u0DFF]/; // Sinhala Unicode block
  return sinhalaRegex.test(text) ? 'si' : 'en'; // 'si' for Sinhala, 'en' for English
}

// Get creative response based on language
function getCreativeResponse(language) {
  if (language === 'si') {
    return "ඔයාට කොහොමද? මට උදව් කල හැකිද? 😊"; // Example Sinhala response
  } else {
    return "How are you doing? Can I help you with anything? 😊"; // Example English response
  }
}

router.get("/", async (req, res) => {
  let num = req.query.number;

  async function RobinPair() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    try {
      const RobinPairWeb = makeWASocket({
        auth: {
          creds: state.creds,
          keys: state.keys,
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
      });

      RobinPairWeb.ev.on("connection.update", async (s) => {
        const { connection } = s;
        if (connection === "open") {
          const user_jid = RobinPairWeb.user.id;

          // Listen for user messages and detect language
          RobinPairWeb.ev.on("messages.upsert", async (msg) => {
            const message = msg.messages[0];
            const language = detectLanguage(message.text); // Detect the language

            // Send a creative reply based on the detected language
            const reply = getCreativeResponse(language);
            await RobinPairWeb.sendMessage(user_jid, { text: reply });
          });

          return await removeFile("./session");
        }
      });
    } catch (err) {
      console.log("Error occurred:", err);
      res.send({ code: "Service Unavailable" });
    }
  }
  await RobinPair();
});

module.exports = router;
