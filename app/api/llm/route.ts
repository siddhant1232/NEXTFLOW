import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { llmTask } from "@/trigger/llm"; // Optional: For type safety

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Trigger the task
    const handle = await tasks.trigger<typeof llmTask>("llm-task", {
      prompt,
    });

    // Wait for it to complete using runs.poll
    const run = await runs.poll(handle);

    if (run.status === "FAILED" || run.status === "CRASHED" || run.error) {
      return Response.json(
        { output: "Error executing Trigger task" },
        { status: 500 }
      );
    }

    // The task returns { output: string }, which matches what the client expects
    const output = run.output?.output || "No response generated";

    return Response.json({ output });
  } catch (error: unknown) {
    console.error("TRIGGER API ERROR:", error);

    return Response.json({
      output: "AI says: fallback response",
    });
  }
}
