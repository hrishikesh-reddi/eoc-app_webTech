import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDyWA4Cp1DzKelr63VUBaJcy7Mm5XAanlY" });
async function run() {
  try {
    const list = await ai.models.list();
    for await (const m of list) {
      if (m.name.includes("flash") || m.name.includes("vision")) {
        console.log(m.name);
      }
    }
  } catch (e: any) {
    console.error(e.message);
  }
}
run();
