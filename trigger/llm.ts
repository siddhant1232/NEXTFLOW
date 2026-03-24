import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenAI } from "@google/genai";

export const llmTask = task({
  id: "llm-task",
  run: async (payload: { prompt: string }) => {
    // We instantiate inside the run function so it uses the env vars correctly
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", 
      contents: `Answer in 2 short lines only.\n${payload.prompt}`,
    });

    return {
      output: response.text || "No response",
    };
  },
});
