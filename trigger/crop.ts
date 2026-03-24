import { task } from "@trigger.dev/sdk/v3";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { writeFile, readFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";

// Link fluent-ffmpeg to the static platform-agnostic binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const cropImageTask = task({
  id: "crop-image-task",
  // A heavier task, good to give it appropriate timeouts/retries
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: { imageBase64: string }) => {
    // 1. Clean the base64 prefix
    const base64Data = payload.imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    // 2. Generate secure temporary paths
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `${randomUUID()}-input.png`);
    const outputPath = path.join(tmpDir, `${randomUUID()}-output.png`);
    
    // Write out the base64 representation to a physical file
    await writeFile(inputPath, base64Data, "base64");
    
    // 3. Command fluent-ffmpeg to process the actual file
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        // Center crop retaining 50% width and 50% height
        .videoFilters('crop=iw/2:ih/2:iw/4:ih/4')
        .save(outputPath)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err));
    });

    // 4. Retrieve the modified disk file and re-encode to Base64 
    const croppedBuffer = await readFile(outputPath);
    const croppedBase64 = `data:image/png;base64,${croppedBuffer.toString("base64")}`;
    
    // 5. Native disk cleanup
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    
    return {
      outputImage: croppedBase64
    };
  }
});
