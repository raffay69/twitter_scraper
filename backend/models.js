import mongoose, { Schema } from "mongoose";
import "dotenv/config";

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");
  } catch (e) {
    console.log(`error connecting to DB ${e.message})`);
  }
}
connect();

const cookieSchema = new Schema({
  cookie: {
    type: String,
    timestamps: true,
  },
});

const trendsSchema = new Schema({
  trends: [
    {
      type: String,
    },
  ],
  DateandTime: {
    type: Date,
  },
  IPAddress: {
    type: String,
  },
});

export const cookieModel = mongoose.model("Cookie", cookieSchema);
export const trendsModel = mongoose.model("Trend", trendsSchema);
