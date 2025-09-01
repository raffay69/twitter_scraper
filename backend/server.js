import express from "express";
import { refreshCookie, scrapperADV } from "./scripts/script.js";
import { cookieModel, trendsModel } from "./models/models.js";
import "dotenv/config";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("running on 4000");
});

app.get("/get-trends", async (req, res) => {
  try {
    console.log("[STEP] Scrapping Started");
    const cookie = await cookieModel.findOne({});
    const parsedCookie = JSON.parse(cookie.cookie);
    const data = await scrapperADV(parsedCookie);
    console.log("[STEP] Scrapping finished");
    const date = new Date();
    const completeData = { ...data, date };
    await trendsModel.create({
      trends: completeData.trends,
      DateandTime: completeData.date,
      IPAddress: completeData.IPAddress,
    });
    res.status(200).json(completeData);
  } catch (err) {
    console.error("[ERROR] Scrapping failed:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/refresh-cookies", async (req, res) => {
  try {
    console.log("[STEP] Refreshing cookies");
    const result = await refreshCookie();
    console.log("[STEP] Cookies are refreshed");
    await cookieModel.updateOne(
      {},
      {
        cookie: result,
      },
      {
        upsert: true,
      }
    );
    res.sendStatus(200);
  } catch (e) {
    console.error("[ERROR] Refreshing failed:", e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/keep-alive", (req, res) => {
  res.send("alive");
});
