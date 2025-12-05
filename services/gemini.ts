import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const suggestSubtasks = async (taskText: string): Promise<string[]> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Break down the following task into 3-5 smaller, actionable subtasks. Keep them concise. Task: "${taskText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as string[];
  } catch (error) {
    console.error("Failed to generate subtasks:", error);
    throw error;
  }
};
