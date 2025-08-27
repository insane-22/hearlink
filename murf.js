import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const response = await axios.post(
  "https://api.murf.ai/v1/speech/generate",
  {
    text: "The 2010 world cup was held in South Africa",
    format: "mp3",
    voiceId: "en-US-natalie",
    pronunciationDictionary: {
      "2010": {
        pronunciation: "two thousand and ten",
        type: "SAY_AS"
      },
      live: {
        pronunciation: "laɪv",
        type: "IPA"
      }
    }
  },
  {
    headers: {
      "api-key": process.env.MURF_API_KEY,
      "Content-Type": "application/json"
    }
  }
);

const body = response.data;
console.log(typeof body.audioFile);
console.log(body.audioFile);