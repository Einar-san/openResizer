/// <reference lib="webworker" />

self.onmessage = async function (e) {
  const { type, id, imageBitmap, options } = e.data;

  if (type !== "resize") return;

  try {
    const { width, height, format, quality } = options;

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    ctx.drawImage(imageBitmap, 0, 0, width, height);
    imageBitmap.close();

    const normalizedQuality = format === "image/png" ? undefined : quality / 100;
    const blob = await canvas.convertToBlob({
      type: format,
      quality: normalizedQuality,
    });

    self.postMessage({ type: "result", id, blob, width, height });
  } catch (err) {
    self.postMessage({
      type: "error",
      id,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
