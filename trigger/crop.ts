import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, readFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";

export const cropImageTask = task({
  id: "crop-image-task",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: { imageBase64: string }) => {
    let inputBuffer: Buffer;
    

    if (payload.imageBase64.startsWith("http")) {
      const res = await fetch(payload.imageBase64);
      const arrayBuf = await res.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuf);
    } else {
      const base64Data = payload.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      inputBuffer = Buffer.from(base64Data, "base64");
    }
    
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `${randomUUID()}-input.png`);
    const outputPath = path.join(tmpDir, `${randomUUID()}-output.png`);
    

    await writeFile(inputPath, inputBuffer);
    

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)

        .videoFilters('crop=iw/2:ih/2:iw/4:ih/4')
        .save(outputPath)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err));
    });


    const croppedBuffer = await readFile(outputPath);
    const croppedBase64 = `data:image/png;base64,${croppedBuffer.toString("base64")}`;
    

    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    
    return {
      outputImage: croppedBase64
    };
  }
});
