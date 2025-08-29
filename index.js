import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import whatsappRouter from "./routes/whatsapp.js";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/whatsapp", whatsappRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
