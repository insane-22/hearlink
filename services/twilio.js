import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendMessage({ from, to, body, mediaUrl }) {
  return client.messages.create({
    from,
    to,
    body,
    mediaUrl,
  });
}
