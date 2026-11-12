import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SearchParams } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function findLeads(params: SearchParams): Promise<Lead[]> {
  const ai = getAI();

  const prompt = `
    Find businesses in India using verified web data with Google Search grounding.
    
    Target Parameters:
    - Industry: ${params.industry} (Mandatory)
    - Geographic Location: ${params.location} (Mandatory)
    ${params.keyword ? `- Business Name / Service Keyword: ${params.keyword}` : ""}
    ${params.details ? `- Further Details about the Business: ${params.details}` : ""}
    ${params.area ? `- Area of Location: ${params.area}` : ""}
    - Maximum Results: ${params.maxResults}
    
    Required Rules:
    1. Focus strictly on businesses located in India.
    2. Use Google Search grounding to verify all information.
    3. Do NOT fabricate or assume any data.
    4. If Email ID, Mobile / Phone Number, or Website is not clearly available from public sources, return it as null.
    5. Each entry must have at least one reliable source URL (official website, Google Business profile, or reputed directory).
    6. De-duplicate results and keep the most authoritative listing.
    7. Do not scrape private, paid, or login-based sources.
    8. Return a message clarifying if fewer valid businesses are found than requested.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leads: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                serialNumber: { type: Type.INTEGER },
                name: { type: Type.STRING },
                address: { type: Type.STRING },
                email: { type: Type.STRING, nullable: true },
                phone: { type: Type.STRING, nullable: true },
                website: { type: Type.STRING, nullable: true },
                otherDetails: { type: Type.STRING },
                sourceUrls: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["serialNumber", "name", "address", "otherDetails", "sourceUrls"]
            }
          },
          note: { type: Type.STRING, description: "A short note if fewer results were found than requested." }
        },
        required: ["leads"]
      }
    }
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Empty response from AI");
  }

  try {
    const data = JSON.parse(rawText);
    return data.leads || [];
  } catch (error) {
    console.error("Failed to parse AI response:", rawText);
    throw new Error("Failed to process business lead data.");
  }
}
