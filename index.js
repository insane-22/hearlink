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

app.post("/whatsapp", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;
  const to = req.body.To;

  console.log("Received:", incomingMsg, "from:", from, "to:", to);
  try {
    const murfRes = await axios.post(
      "https://api.murf.ai/v1/speech/generate",
      {
        text: incomingMsg,
        format: "mp3",
        voiceId: "en-US-natalie",
      },
      {
        headers: {
          "api-key": process.env.MURF_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const murfJson = murfRes.data;
    const audioUrl = murfJson.audioFile;
    await client.messages.create({
      from: to,
      to: from,
      mediaUrl: [audioUrl],
    });
    res.send("OK");
  } catch (error) {
    console.error("Error:", error);
    await client.messages.create({
      from: to,
      to: from,
      body: "Sorry, voice reply failed. Here's text instead: " + incomingText,
    });

    res.send("Fallback OK");
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
