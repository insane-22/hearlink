import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import twilio from "twilio";

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
  const audioUrl =
    "https://murf.ai/user-upload/one-day-temp/19ce52a3-eb35-4538-877d-8aa4fe07d981.mp3?response-cache-control=max-age%3D604801&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250827T000000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=259200&X-Amz-Credential=AKIA27M5532DYKBCJICE%2F20250827%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=2946f653535d457aec4315ac96855394a13a3fc00a493a9f2806ba992c1819b3";

  console.log("Received:", incomingMsg, "from:", from, "to:", to);

  await client.messages.create({
    from: to, 
    to: from, 
    mediaUrl: [audioUrl],
  });

  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
