import express from "express";
import { sendMessage } from "../services/twilio.js";
import { translateText, textToSpeech } from "../services/murf.js";
import { getUserState, resetUserState } from "../state/userState.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;
  const to = req.body.To;

  console.log("Received:", incomingMsg, "from:", from, "to:", to);

  const state = getUserState(from);

  try {
    // --- Step 1: Greeting & Menu ---
    if (
      incomingMsg.toLowerCase() === "hi" ||
      incomingMsg.toLowerCase() === "hello"
    ) {
      state.step = "menu";
      await sendMessage({
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

    // --- Step 2: Menu choice ---
    if (state.step === "menu") {
      if (incomingMsg === "1") {
        state.step = "translate";
        await sendMessage({
          from: to,
          to: from,
          body: "Send the text you want translated.",
        });
      } else if (incomingMsg === "2") {
        state.step = "audio";
        await sendMessage({
          from: to,
          to: from,
          body: "Send the text you want converted to audio.",
        });
      } else if (incomingMsg === "3") {
        state.step = "both";
        await sendMessage({
          from: to,
          to: from,
          body: "Send the text for translation + audio.",
        });
      } else {
        await sendMessage({
          from: to,
          to: from,
          body: "Invalid option. Try again.",
        });
      }
      return res.send("OK");
    }

    // --- Step 3: Translate ---
    if (state.step === "translate") {
      const translated = await translateText(incomingMsg, "hi-IN");
      await sendMessage({
        from: to,
        to: from,
        body: `Translation: ${translated}`,
      });
      resetUserState(from);
      return res.send("OK");
    }

    // --- Step 4: Audio ---
    if (state.step === "audio") {
      const audioUrl = await textToSpeech(incomingMsg);
      await sendMessage({ from: to, to: from, mediaUrl: [audioUrl] });
      resetUserState(from);
      return res.send("OK");
    }

    // --- Step 5: Both ---
    if (state.step === "both") {
      const translated = await translateText(incomingMsg, "hi-IN");
      const audioUrl = await textToSpeech(translated);

      await sendMessage({
        from: to,
        to: from,
        body: `Translation: ${translated}`,
      });
      await sendMessage({ from: to, to: from, mediaUrl: [audioUrl] });

      resetUserState(from);
      return res.send("OK");
    }

    // --- Default fallback ---
    await sendMessage({
      from: to,
      to: from,
      body: "Type 'hi' to start again ^_^",
    });
    resetUserState(from);
    return res.send("OK");
  } catch (error) {
    console.error("Error:", error.message);
    await sendMessage({
      from: to,
      to: from,
      body: "Something went wrong. Please try again later.",
    });
    resetUserState(from);
    return res.send("Error handled");
  }
});

export default router;
