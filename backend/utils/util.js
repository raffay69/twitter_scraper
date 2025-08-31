import TorControl from "tor-control";
import "dotenv/config";

const tor = new TorControl({
  host: "0.0.0.0",
  port: 9051,
  password: process.env.TOR_PASSWORD,
});

export function newTorIdentity() {
  return new Promise((resolve, reject) => {
    tor.signalNewnym((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
