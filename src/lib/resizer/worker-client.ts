import type { OutputFormat, WorkerResult } from "@/types";

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker("/workers/resize.worker.js");
  }
  return worker;
}

export function resizeWithWorker(
  imageBitmap: ImageBitmap,
  id: string,
  options: {
    width: number;
    height: number;
    format: OutputFormat;
    quality: number;
  }
): Promise<WorkerResult> {
  return new Promise((resolve) => {
    const w = getWorker();

    const handler = (e: MessageEvent<WorkerResult>) => {
      if (e.data.id === id) {
        w.removeEventListener("message", handler);
        resolve(e.data);
      }
    };

    w.addEventListener("message", handler);

    w.postMessage(
      {
        type: "resize",
        id,
        imageBitmap,
        options,
      },
      [imageBitmap]
    );
  });
}

export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
