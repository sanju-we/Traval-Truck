import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function validateTripPlan(tripData) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const prompt = `
You are a travel feasibility and budget validator.

IMPORTANT:
You MUST return a JSON object that EXACTLY matches the structure below.
Do NOT add or remove keys.
Do NOT rename keys.
Do NOT add markdown, code blocks, or explanations.
Do NOT include any text outside the JSON.

You MUST:
- Use ONLY the provided Trip Data
- Rearrange and interpret values logically
- Allocate time realistically based on minimum safe driving speed
- Distribute available time between driving, food, and activities
- Include room cost using the ROOM COST RULES below
- Summarize feasibility, risks, and improvements clearly for a normal user

You MUST NOT:
- Recalculate distances or fuel cost
- Assume prices EXCEPT the room costs defined below
- Change numeric values unless explicitly derived from given data

ROOM COST RULES (MANDATORY):
- 5star: 10000 INR per night
- 4star: 6000 INR per night
- 3star: 3000 INR per night
- below3star: 1500 INR per night

Rules:
- Use roomType from Trip Data
- Nights = daysAvailable - 1
- If daysAvailable = 1 → room cost = 0
- Add room cost ONLY to totalApproximateBudget
- Explain room cost inside budgetReliabilityDetails

====================
RESPONSE JSON FORMAT
====================

{
  "tripValidationSummary": {
    "feasibilityStatus": "Highly Feasible | Feasible | Tight | Not Feasible",
    "feasibilityDetails": "",
    "dailyTravelDistanceReality": "Realistic | Borderline | Unrealistic",
    "dailyTravelDistanceDetails": "",
    "budgetReliability": "Reliable | Generally Reliable | Risky",
    "budgetReliabilityDetails": "",
    "risks": [],
    "improvements": []
  },
  "tripDetails": {
    "route": [],
    "totalDistanceKm": 0,
    "daysAvailable": 0,
    "peopleTraveling": 0,
    "vehicleType": "",
    "vehicleMileageKmpl": 0,
    "foodPreference": ""
  },
  "budget": {
    "fuelAmount": 0,
    "foodAmount": 0,
    "totalApproximateBudget": 0
  },
  "timeAllocation": {
    "drivingHoursAllocatedPerDay": 0,
    "estimatedActualDrivingTimeInVehicle": "",
    "timeForFoodAndActivities": ""
  }
}

====================
TRIP DATA
====================

${JSON.stringify(tripData, null, 2)}
`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log('result.res', result.response);
    // IMPORTANT: Gemini returns text → parse safely
    console.log('responseText:', responseText);
    try {
        const cleaned = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("No JSON object found in AI response");
        }
        const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
        console.log('return data', JSON.parse(jsonString));
        return JSON.parse(jsonString);
    }
    catch {
        throw new Error("AI returned invalid JSON");
    }
}
