import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import twilio from "twilio";
import axios from "axios";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT;
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const userState = {};
async function translateText(text, targetLang = "hi-IN") {
  const response = await axios.post(
    "https://api.murf.ai/v1/text/translate",
    {
      targetLanguage: "hi-IN",
      texts: [text],
    },
    {
      headers: {
        "api-key": process.env.MURF_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.translations[0].translated_text;
}

async function textToSpeech(text, voiceId = "en-US-natalie") {
  const res = await axios.post(
    "https://api.murf.ai/v1/speech/generate",
    {
      text,
      format: "mp3",
      voiceId,
    },
    {
      headers: {
        "api-key": process.env.MURF_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.audioFile;
}

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;
  const to = req.body.To;

  console.log("Received:", incomingMsg, "from:", from, "to:", to);

  if (!userState[from]) userState[from] = { step: "init" };
  const state = userState[from];

  try {
    // --- Step 1: Show Menu ---
    if (
      incomingMsg.toLowerCase() === "hi" ||
      incomingMsg.toLowerCase() === "hello"
    ) {
      state.step = "menu";
      await client.messages.create({
        from: to,
        to: from,
        body: `Hello! Welcome to Hearlink :)
What would you like me to do? 
1. Translate text to Hindi
2. Convert a text to Audio 
3. Do 1 & 2 together
Please reply with 1, 2, or 3.`,
      });
      return res.send("OK");
    }

    // --- Step 2: Handle Menu Choice ---
    if (state.step === "menu") {
      if (incomingMsg === "1") {
        state.step = "translate";
        await client.messages.create({
          from: to,
          to: from,
          body: "Please send the text you want translated.",
        });
      } else if (incomingMsg === "2") {
        state.step = "audio";
        await client.messages.create({
          from: to,
          to: from,
          body: "Send me the text you want converted to audio.",
        });
      } else if (incomingMsg === "3") {
        state.step = "both";
        await client.messages.create({
          from: to,
          to: from,
          body: "Send me the text you want translated + converted to audio.",
        });
      } else {
        await client.messages.create({
          from: to,
          to: from,
          body: "Invalid option selected.",
        });
      }
      return res.send("OK");
    }

    // --- Step 3: Handle Translate ---
    if (state.step === "translate") {
      const translatedText = await translateText(incomingMsg, "hi-IN");
      await client.messages.create({
        from: to,
        to: from,
        body: `Translation: ${translatedText}`,
      });
      state.step = "init";
      return res.send("OK");
    }

    // --- Step 4: Handle Audio (Murf AI) ---
    if (state.step === "audio") {
      const audioUrl = await textToSpeech(incomingMsg);
      await client.messages.create({
        from: to,
        to: from,
        mediaUrl: [audioUrl],
      });
    }

    // --- Step 5: Handle Both ---
    if (state.step === "both") {
      const translatedText = await translateText(incomingMsg, "hi-IN");
      const audioUrl = await textToSpeech(translatedText);

      await client.messages.create({
        from: to,
        to: from,
        body: `🌍✅ Translation: ${translatedText}`,
      });

      await client.messages.create({
        from: to,
        to: from,
        mediaUrl: [audioUrl],
      });

      state.step = "init";
      return res.send("OK");
    }

    await client.messages.create({
      from: to,
      to: from,
      body: "Please type 'hi' to start again ^_^",
    });
    state.step = "init";
    return res.send("OK");
  } catch (error) {
    console.error("Error:", error);
    await client.messages.create({
      from: to,
      to: from,
      body: "Sorry, voice reply failed. Here's text instead: " + incomingMsg,
    });

    return res.send("Fallback OK");
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
