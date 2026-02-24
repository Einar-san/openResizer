import type { InputFormat, OutputFormat, ResizePreset } from "@/types";

export const MAX_BATCH_SIZE = 3;
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
export const MAX_TOTAL_SIZE = 60 * 1024 * 1024; // 60 MB

export const ACCEPTED_INPUT_TYPES: InputFormat[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

export const ACCEPTED_EXTENSIONS =
  ".jpg,.jpeg,.png,.webp,.avif,.gif,.svg,.bmp,.tiff,.tif";

export const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
];

export const RESIZE_PRESETS: ResizePreset[] = [
  { label: "Thumbnail", width: 150, height: 150, category: "General" },
  { label: "Profile Picture", width: 400, height: 400, category: "General" },
  { label: "Facebook Cover", width: 1200, height: 630, category: "Social" },
  { label: "Instagram Post", width: 1080, height: 1080, category: "Social" },
  { label: "Twitter Header", width: 1500, height: 500, category: "Social" },
  { label: "YouTube Thumbnail", width: 1280, height: 720, category: "Social" },
  { label: "HD (720p)", width: 1280, height: 720, category: "Resolution" },
  { label: "Full HD (1080p)", width: 1920, height: 1080, category: "Resolution" },
  { label: "4K (2160p)", width: 3840, height: 2160, category: "Resolution" },
];

export const PERCENTAGE_OPTIONS = [25, 50, 75, 100, 125, 150, 200];

export const DEFAULT_QUALITY = 85;

export const DEFAULT_RESIZE_OPTIONS = {
  mode: "dimensions" as const,
  width: 0,
  height: 0,
  percentage: 100,
  preset: null,
  maintainAspectRatio: true,
  outputFormat: "image/jpeg" as OutputFormat,
  quality: DEFAULT_QUALITY,
};
