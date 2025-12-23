import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url part (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePhysique = async (file: File): Promise<AnalysisResult> => {
  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    Analyze this image from a fitness and physiotherapy perspective. 
    1. Identify if there is a person in the image. If not, set 'detected' to false.
    2. If a person is detected, analyze their physique, posture, and muscle development.
    3. Identify "Target Areas" (lagging muscle groups, imbalances, or areas that need work).
    4. Note any posture observations (e.g., rounded shoulders, anterior pelvic tilt, good alignment).
    5. Suggest a specific workout routine with 4-6 exercises targeting these areas.
    6. Estimate body fat percentage range if visible (e.g. "15-20%").
    
    Be professional, constructive, and encouraging. Focus on aesthetics and functional health.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            summary: { type: Type.STRING, description: "A 2-3 sentence overview of the analysis." },
            targetAreas: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific body parts to focus on."
            },
            postureNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Observations about posture."
            },
            estimatedBodyFat: { type: Type.STRING },
            routine: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.INTEGER },
                  reps: { type: Type.STRING },
                  focus: { type: Type.STRING, description: "Why this exercise was chosen." }
                },
                required: ["name", "sets", "reps", "focus"]
              }
            }
          },
          required: ["detected", "summary", "targetAreas", "postureNotes", "routine"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const generateFuturePhysique = async (file: File, targetAreas: string[]): Promise<string> => {
  const imagePart = await fileToGenerativePart(file);
  
  // Prompt for Gemini 2.5 Flash Image (Nano Banana) to edit the image
  const prompt = `
    The user is following a fitness routine to improve these areas: ${targetAreas.join(', ')}.
    Generate a photorealistic "after" image of this person.
    1. Show visible muscle growth and definition in the target areas (hypertrophy).
    2. Improve posture if needed.
    3. CRITICAL: Keep the face, skin tone, background, and lighting EXACTLY the same.
    4. The result should look like a natural progression after 6 months of training.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      // Note: responseMimeType and responseSchema are NOT supported for image generation models
    });

    // Extract the generated image from the response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw new Error("Failed to generate progress visualization.");
  }
};
