
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // On ne définit pas l'instance ici pour éviter de lire process.env trop tôt
  
  async editImage(base64Data: string, mimeType: string, prompt: string): Promise<string> {
    try {
      // Création de l'instance juste avant l'appel (conforme aux recommandations)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
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
        throw new Error("Le modèle n'a pas renvoyé d'image modifiée.");
      }

      return editedImageUrl;
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error?.message?.includes('API key')) {
        throw new Error("Clé API invalide ou manquante. Vérifiez votre fichier .env.local");
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
