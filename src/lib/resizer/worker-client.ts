import type { OutputFormat, WorkerResult } from "@/types";

let worker: Worker | null = null;
const pendingRejects = new Set<(reason: Error) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker("workers/resize.worker.js");
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
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const cleanup = () => {
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
      pendingRejects.delete(reject);
    };

    const onMessage = (e: MessageEvent<WorkerResult>) => {
      if (e.data.id === id) {
        cleanup();
        resolve(e.data);
      }
    };

    const onError = (e: ErrorEvent) => {
      cleanup();
      reject(new Error(e.message || "Worker error"));
    };

    pendingRejects.add(reject);
    w.addEventListener("message", onMessage);
    w.addEventListener("error", onError);

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
  for (const reject of pendingRejects) {
    reject(new Error("Worker terminated"));
  }
  pendingRejects.clear();
}
