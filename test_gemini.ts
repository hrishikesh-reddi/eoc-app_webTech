import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
          role: "user",
          parts: [
            { text: "return JSON: {\"isValid\": true}" }
          ]
      }],
      config: {
        responseMimeType: "application/json"
      }
    });
    console.log(response.text);
  } catch (e: any) {
    console.error("ERROR:");
    console.error(e.message);
  }
}
run();
