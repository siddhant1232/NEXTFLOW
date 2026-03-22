import { task } from "@trigger.dev/sdk";

export const llmTask = task({
  id: "llm-task",

  run: async (payload: { input: string }) => {

    await new Promise((res) => setTimeout(res, 1000));

    return {
      output: "AI says: " + payload.input,
    };
  },
});