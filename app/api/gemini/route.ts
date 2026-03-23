import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();


    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", 
      contents: `Answer in 2 short lines only.\n${prompt}`,
    });

    const output = response.text || "No response";

    return Response.json({ output });

  } catch (error: unknown) {
    console.error("GEMINI ERROR:", error);

    return Response.json({
      output: "AI says: fallback response",
    });
  }
}