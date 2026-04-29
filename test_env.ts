import "dotenv/config";
console.log("Current Key:", process.env.GEMINI_API_KEY ? `'${process.env.GEMINI_API_KEY.substring(0, 5)}...' length=${process.env.GEMINI_API_KEY.length}` : 'MISSING');
