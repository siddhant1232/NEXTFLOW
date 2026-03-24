import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenAI } from "@google/genai";

export const llmTask = task({
  id: "llm-task",
  run: async (payload: { prompt: string; imageUrl?: string }) => {
    // We instantiate inside the run function so it uses the env vars correctly
    const ai = new GoogleGenAI({});

    const parts: any[] = [{ text: `Answer in 2 short lines only.\n${payload.prompt}` }];

    if (payload.imageUrl) {
      if (payload.imageUrl.startsWith("http")) {
        const res = await fetch(payload.imageUrl);
        const arrayBuf = await res.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString("base64");
        parts.push({
          inlineData: {
            data: base64,
            mimeType: res.headers.get("content-type") || "image/jpeg",
          },
        });
      } else if (payload.imageUrl.startsWith("data:image")) {
        const matches = payload.imageUrl.match(/^data:(image\/\w+);base64,(.+)/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", 
      contents: parts, // Pass structured text and images natively
    });

    return {
      output: response.text || "No response",
    };
  },
});
