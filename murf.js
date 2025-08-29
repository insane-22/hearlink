import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function translate() {
  try {
    const response = await axios.post(
      "https://api.murf.ai/v1/text/translate",
      {
        targetLanguage: "hi-IN",
        texts: ["Hello, how are you?"],
      },
      {
        headers: {
          "api-key": process.env.MURF_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data.translations[0].translated_text);
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
  }
}

translate();
