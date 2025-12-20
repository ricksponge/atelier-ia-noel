
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async editImage(base64Data: string, mimeType: string, prompt: string): Promise<string> {
    const apiKey = process.env.API_KEY;

    if (!apiKey || apiKey === '') {
      throw new Error("Clé API manquante. Si vous êtes sur Vercel, vérifiez que vous avez ajouté API_KEY dans Environment Variables et que vous avez REDÉPLOYÉ.");
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let editedImageUrl = '';
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            editedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!editedImageUrl) {
        throw new Error("L'IA n'a pas pu générer l'image. Essayez un prompt plus simple.");
      }

      return editedImageUrl;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error?.message?.includes('API key')) {
        throw new Error("La clé API fournie est rejetée par Google. Vérifiez sa validité sur aistudio.google.com");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
