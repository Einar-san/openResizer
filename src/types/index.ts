export type InputFormat =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/avif"
  | "image/gif"
  | "image/svg+xml"
  | "image/bmp"
  | "image/tiff";

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export type ResizeMode = "dimensions" | "percentage" | "preset";

export interface ResizePreset {
  label: string;
  width: number;
  height: number;
  category: string;
}

export interface ResizeOptions {
  mode: ResizeMode;
  width: number;
  height: number;
  percentage: number;
  preset: ResizePreset | null;
  maintainAspectRatio: boolean;
  outputFormat: OutputFormat;
  quality: number;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
}

export type ProcessingStatus = "idle" | "processing" | "done" | "error";

export interface ProcessedImage {
  id: string;
  sourceId: string;
  blob: Blob;
  name: string;
  width: number;
  height: number;
  size: number;
  format: OutputFormat;
  previewUrl: string;
}

export interface ProcessingProgress {
  imageId: string;
  status: ProcessingStatus;
  progress: number;
  error?: string;
}

export interface WorkerMessage {
  type: "resize";
  id: string;
  imageBitmap: ImageBitmap;
  options: {
    width: number;
    height: number;
    format: OutputFormat;
    quality: number;
  };
}

export interface WorkerResult {
  type: "result" | "error";
  id: string;
  blob?: Blob;
  width?: number;
  height?: number;
  error?: string;
}

export interface ValidationError {
  file: File;
  reason: string;
}
