import { tasks, runs } from "@trigger.dev/sdk/v3";
import type { cropImageTask } from "@/trigger/crop"; 

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return Response.json({ output: null }, { status: 400 });
    }

    // Proxy the image bytes into Trigger's resilient queue
    const handle = await tasks.trigger<typeof cropImageTask>("crop-image-task", {
      imageBase64,
    });

    // Indefinitely hold Next server response until background FFmpeg processing finishes
    const run = await runs.poll(handle);

    if (run.status === "FAILED" || run.status === "CRASHED" || run.error) {
       console.error("CROP ERROR:", run.error);
       return Response.json({ error: "Crop Failed" }, { status: 500 });
    }

    const outputImage = run.output?.outputImage || null;

    return Response.json({ image: outputImage });
  } catch (error: unknown) {
    console.error("TRIGGER API ERROR:", error);
    return Response.json({ image: null }, { status: 500 });
  }
}
