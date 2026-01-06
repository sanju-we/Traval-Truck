import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function validateTripPlan(tripData: any) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are a travel feasibility and budget validator.

TASKS:
1. Check if the trip is feasible within the given days and driving hours.
2. Validate whether daily travel distance is realistic.
3. Assess budget reliability.
4. Identify risks.
5. Suggest improvements if needed.

STRICT RULES:
- Do NOT recalculate distance, fuel, or costs.
- Use only the provided values.
- Do NOT assume external prices.
- Respond ONLY in valid JSON.

RESPONSE I NEEDED:
- Depend on the data re-arrage the food amount, fuel amount, the time the user only want to spend in the vehicle with minimum speed, how many time will user got to spend in a place for food and other activity 
- Mention everything that given above and create a object and as JSON
- Also return JSON keep simple and readable by user 
- Find out the total approximatly budget for the trip and return 

Trip Data:
${JSON.stringify(tripData, null, 2)}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // IMPORTANT: Gemini returns text → parse safely
  console.log('responseText:',responseText)
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
}
