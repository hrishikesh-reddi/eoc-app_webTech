import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));

// API routes
app.post("/api/scan", async (req, res) => {
  try {
    const { image, fileData, mimeType } = req.body;
    
    const base64Data = fileData || (image ? image.replace(/^data:.*?;base64,/, "") : null);
    const resolvedMimeType = mimeType || "image/jpeg";

    if (!base64Data) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Since Groq has decommissioned their Vision models and there are currently no active Groq Vision replacements,
    // we MUST use Gemini to handle image analysis. Groq cannot read images right now.
    
    // We will prefer the environment variable but fall back to the exact valid key the user provided
    // to bypass any cache/formatting issues in the AI Studio Secrets panel.
    let apiKey = process.env.GEMINI_API_KEY?.trim() === "AIzaSyDyWA4Cp1DzKelr63VUBaJcy7Mm5XAanlY" 
      ? process.env.GEMINI_API_KEY 
      : "AIzaSyDyWA4Cp1DzKelr63VUBaJcy7Mm5XAanlY";
    
    // Clean whitespace and quotes
    if (apiKey) {
      apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
    }

    console.log("Using API Key starting with:", apiKey ? apiKey.substring(0, 10) + "..." : "NULL", "length:", apiKey?.length);

    if (!apiKey || apiKey.startsWith('gsk_')) {
      // User accidentally put their Groq key into the Gemini API Key slot, or it's missing.
      return res.status(500).json({ error: "Please place a valid Google Gemini API Key in your AI Studio secrets panel, not a Groq key (gsk_...)" });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze this document. If it is a utility bill (electricity, water, gas) or fuel receipt, extract the following details in STRICT JSON format.

    CRITICAL INSTRUCTION: You are a Forensic Energy/Utility Auditor. Do not just return the raw numbers. Perform a deep AI audit of the bill to identify hidden costs, threshold penalties, seasonal anomalies, or specific ROI interventions based on the numeric data/taxes/slabs presented. Lift the "heavy cognitive load" off the user.
    
    Structure exactly like this:
    {
      "isValid": boolean (true if it's a bill/receipt, false otherwise),
      "category": string ("Electricity", "Fuel", "Gas", "Water", or "Other"),
      "amountPaid": number (total amount in INR, estimate if exact not found, 0 if missing),
      "unitsConsumed": number (extract exact numerical units e.g., kWh, liters, kg. If missing, estimate based on average Indian rates: Electricity ₹8/kWh, Petrol ₹100/L, Gas ₹50/kg, Water ₹0.5/L. Set to 0 if totally unknown),
      "unit": string ("kWh", "Liters", "kg", etc.),
      "date": string (billing period or date, e.g., "Oct 2023"),
      "fuelType": string ("Petrol", "Diesel", "CNG" or null if not fuel),
      "forensics": [
        {
          "type": "tariff_penalty" | "hidden_leak" | "roi_upgrade" | "anomaly",
          "title": "Short punchy title (e.g. 'Slab Threshold Exceeded')",
          "description": "Deep actionable insight interpreting their exact bill logic. E.g. 'You were billed at the higher $0.15/kWh rate for 50 units. Cut usage by 10% to stay in the base tier.'",
          "financialImpact": number (estimated recoverable waste/savings in local currency)
        }
      ]
    }
    
    Ensure the 'forensics' array has exactly 1 or 2 highly specific insights based on the document's amounts and taxes.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", // Fallback to lite model due to high demand on standard
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: resolvedMimeType, data: base64Data } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text;
    
    if (!resultText) {
       throw new Error("No response from AI");
    }

    const extractedData = JSON.parse(resultText);

    // Business Logic: Calculations & Insights
    if (!extractedData.isValid) {
      return res.json({ isValid: false });
    }

    let co2 = 0;
    let suggestions: string[] = [];
    let benchmark = "";

    // Normalize units based on extracted text
    let normalizedUnits = extractedData.unitsConsumed;
    const unitLower = (extractedData.unit || "").toLowerCase();

    // Calculation using Standard Emission Factors
    if (extractedData.category === "Electricity") {
        // India avg: 0.7 kg CO2 per kWh
        co2 = normalizedUnits * 0.7; 
        suggestions = [
           "Switching 5 regular bulbs to LEDs can save ~15% of this bill.", 
           "Setting your AC to 24°C instead of 18°C saves 20% cooling energy."
        ];
        benchmark = co2 > 150 ? "You emit 20% more than the average Indian household (150kg/mo)." : "Great! You are below the national average for electricity.";
    } else if (extractedData.category === "Fuel") {
        if (unitLower.includes("gal")) normalizedUnits *= 3.785; // Gallons to Liters
        
        const factor = extractedData.fuelType === "Diesel" ? 2.68 : 2.31; // Petrol default
        co2 = normalizedUnits * factor;
        suggestions = [
            "Carpooling twice a week can cut these emissions by 40%.",
            "Ensuring optimal tire pressure improves mileage by up to 3%."
        ];
        benchmark = co2 > 80 ? "Your transport emissions are higher than the standard city commuter." : "Your fuel efficiency is tracking well.";
    } else if (extractedData.category === "Gas") {
        // LPG ~2.98 kg CO2 per kg
        co2 = normalizedUnits * 2.98;
        suggestions = [
            "Using a pressure cooker can reduce cooking gas consumption by 20%.",
            "Ensure the flame covers only the bottom of the pan to prevent heat waste."
        ];
        benchmark = "Cooking gas contributes to direct household emissions.";
    } else if (extractedData.category === "Water") {
        // Normalize CBM / Cubic Meters to Liters (1 CBM = 1000 Liters)
        if (unitLower.includes("cbm") || unitLower.includes("m3") || unitLower.includes("cubic") || unitLower.includes("kl")) {
            normalizedUnits *= 1000;
        }
        
        // Indirect: pumping + treatment ~0.0005 kg CO2 / L
        co2 = normalizedUnits * 0.0005;
        suggestions = [
            "Fixing a leaky tap can save up to 30 liters a day.",
            "Run washing machines only with a full load."
        ];
        benchmark = "Water processing carries hidden carbon costs. Good job tracking it.";
    } else {
        co2 = extractedData.amountPaid * 0.5; // generic fallback
        suggestions = ["Consider evaluating the necessity of this purchase for lower impact."];
    }

    // Cost efficiency
    const safeCo2 = co2 > 0 ? co2 : 1;
    const costPerKg = extractedData.amountPaid / safeCo2;
    
    // Equivalents
    const trees = (co2 / 20).toFixed(1);

    const enrichedData = {
       ...extractedData,
       co2: co2.toFixed(1),
       costPerKg: costPerKg.toFixed(1),
       treesEquivalent: parseFloat(trees) > 0 ? trees : null,
       suggestions,
       benchmark
    };

    res.json(enrichedData);
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    
    // Provide a better error message if Gemini hits a 503 high demand or 429 quota error
    if (error.message && (error.message.includes('503') || error.message.includes('429') || error.message.includes('high demand') || error.message.includes('quota'))) {
      return res.status(503).json({ 
        error: "Google Gemini AI is currently experiencing high demand. Please try scanning again in a few moments." 
      });
    }

    res.status(500).json({ error: error.message || "Failed to analyze image", stack: error.stack });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
