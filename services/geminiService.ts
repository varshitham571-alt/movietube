
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectCommercialProducts = async (base64Image: string): Promise<GeminiResponse> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    ACTIVATE NEURAL PERCEPTION SCAN.
    OBJECTIVE: Extract an exhaustive list of every commercial entity in this frame with microscopic detail.
    
    INTELLIGENCE PARAMETERS:
    1. IDENTIFICATION: Determine exact product names, brands (if visible/inferable), and categories.
    2. ATTRIBUTES: Analyze material (leather, brushed metal, linen), style (minimalist, industrial, boho), and specific colors.
    3. SEARCH OPTIMIZATION: Format the 'name' field as a high-conversion e-commerce search query.
    4. EXHAUSTION: Scan for tiny background items, decor, lighting fixtures, and accessories that are often missed.
    
    SYSTEM INSTRUCTION: Be extremely literal and objective. If it's a lamp, what kind of lamp? If it's a person's watch, what is the closest commercial equivalent?
    
    OUTPUT: Strictly valid JSON.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                attributes: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                confidence: { type: Type.NUMBER }
              },
              required: ["name", "category", "description", "confidence"]
            }
          }
        },
        required: ["items"]
      }
    }
  });

  try {
    const text = response.text || "{\"items\":[]}";
    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Neural Scan Failure:", error);
    return { items: [] };
  }
};
