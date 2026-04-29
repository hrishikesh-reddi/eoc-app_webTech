import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDyWA4Cp1DzKelr63VUBaJcy7Mm5XAanlY" });
async function run() {
  try {
    const fileData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/png", data: fileData } },
            { text: "return JSON: {\"isValid\": true}" }
          ]
      }],
      config: {
        responseMimeType: "application/json"
      }
    });
    console.log("2.5-flash-lite Works!", response.text);
  } catch (e: any) {
    console.error("2.5-flash-lite Error:");
    console.error(e.message);
  }
}
run();
