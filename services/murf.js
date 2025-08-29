import axios from "axios";

const MURF_BASE = "https://api.murf.ai/v1";

export async function translateText(text, targetLang = "hi-IN") {
  const response = await axios.post(
    `${MURF_BASE}/text/translate`,
    {
      targetLanguage: targetLang,
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

export async function textToSpeech(text, voiceId = "en-US-natalie") {
  const response = await axios.post(
    `${MURF_BASE}/speech/generate`,
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
  return response.data.audioFile;
}
