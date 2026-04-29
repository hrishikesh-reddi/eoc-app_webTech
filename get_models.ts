import Groq from "groq-sdk";
const groq = new Groq({ apiKey: "YOUR_API_KEY" });
async function run() {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.2-90b-vision-instruct",
            messages: [{ role: "user", content: "hello" }]
        });
        console.log("Success with 90b instruct!");
    } catch(e) {
        console.error("90b instruct failed: ", (e as any).message);
    }
    
    try {
        const response2 = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-instruct",
            messages: [{ role: "user", content: "hello" }]
        });
        console.log("Success with 11b instruct!");
    } catch(e) {
        console.error("11b instruct failed: ", (e as any).message);
    }
}
run();
