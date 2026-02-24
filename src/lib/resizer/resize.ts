import type { OutputFormat, ResizeOptions, ImageFile } from "@/types";

export function computeOutputDimensions(
  image: ImageFile,
  options: ResizeOptions
): { width: number; height: number } {
  const { originalWidth, originalHeight } = image;

  switch (options.mode) {
    case "percentage": {
      const scale = options.percentage / 100;
      return {
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale),
      };
    }

    case "preset": {
      if (!options.preset) return { width: originalWidth, height: originalHeight };
      return { width: options.preset.width, height: options.preset.height };
    }

    case "dimensions": {
      let w = options.width || originalWidth;
      let h = options.height || originalHeight;

      if (options.maintainAspectRatio) {
        const aspectRatio = originalWidth / originalHeight;

        if (options.width && !options.height) {
          h = Math.round(w / aspectRatio);
        } else if (options.height && !options.width) {
          w = Math.round(h * aspectRatio);
        } else if (options.width && options.height) {
          // Use width as the constraint, adjust height
          h = Math.round(w / aspectRatio);
        }
      }

      return { width: Math.max(1, w), height: Math.max(1, h) };
    }

    default:
      return { width: originalWidth, height: originalHeight };
  }
}

export function getOutputFileName(
  originalName: string,
  format: OutputFormat
): string {
  const baseName = originalName.replace(/\.[^.]+$/, "");
  const ext = formatToExtension(format);
  return `${baseName}_resized.${ext}`;
}

function formatToExtension(format: OutputFormat): string {
  switch (format) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
  }
}

export function resizeImageOnCanvas(
  imageBitmap: ImageBitmap,
  width: number,
  height: number,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const normalizedQuality = format === "image/png" ? undefined : quality / 100;
  return canvas.convertToBlob({ type: format, quality: normalizedQuality });
}
