
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Fix: Initialize GoogleGenAI exclusively with process.env.API_KEY using named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getThinkingResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un simpático guía de la selva llamado 'Kidoo'. Tu objetivo es ayudar a niños de 9-10 años (4to de primaria) con sus preguntas escolares. Responde de forma divertida, usa analogías de animales y naturaleza. Usa emojis de selva (🌿, 🦁, 🐒, 🦜) y mantén las respuestas breves y claras.",
        temperature: 0.7,
      },
    });
    // Fix: Access response text via .text property, not .text() method
    return response.text || "¡Caracoles! Mi brújula se perdió. ¿Podrías preguntar de nuevo?";
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Lo siento, amiguito. Se cortaron las lianas de comunicación.";
  }
};

export const generateArt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Dibujo estilo caricatura vibrante para niños, tema de selva y animales, muy colorido y alegre de: ${prompt}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Fix: Iterate through all parts to find the image part (inlineData)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const searchKnowledge = async (query: string, location?: { latitude: number; longitude: number }): Promise<{text: string, sources: any[]}> => {
  try {
    const config: any = {
      tools: [{ googleSearch: {} }]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explícame esto como si fuéramos en una expedición por la selva para niños de 4to grado: ${query}`,
      config
    });

    return {
      text: response.text || "",
      // Fix: Extract grounding chunks to allow UI to list website URLs correctly
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error in knowledge search:", error);
    return { text: "No pude encontrar el rastro en mis libros de expedición.", sources: [] };
  }
};
