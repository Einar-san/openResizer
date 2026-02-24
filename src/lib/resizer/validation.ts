import {
  MAX_BATCH_SIZE,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  ACCEPTED_INPUT_TYPES,
} from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";
import type { InputFormat, ValidationError } from "@/types";

export function validateFiles(
  newFiles: File[],
  existingCount: number,
  existingTotalSize: number
): { valid: File[]; errors: ValidationError[] } {
  const valid: File[] = [];
  const errors: ValidationError[] = [];

  const availableSlots = MAX_BATCH_SIZE - existingCount;
  if (availableSlots <= 0) {
    newFiles.forEach((file) =>
      errors.push({
        file,
        reason: `Maximum ${MAX_BATCH_SIZE} images allowed`,
      })
    );
    return { valid, errors };
  }

  const filesToProcess = newFiles.slice(0, availableSlots);
  if (newFiles.length > availableSlots) {
    newFiles.slice(availableSlots).forEach((file) =>
      errors.push({
        file,
        reason: `Maximum ${MAX_BATCH_SIZE} images allowed`,
      })
    );
  }

  let runningTotal = existingTotalSize;

  for (const file of filesToProcess) {
    if (!ACCEPTED_INPUT_TYPES.includes(file.type as InputFormat)) {
      errors.push({ file, reason: "Unsupported file format" });
      continue;
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push({
        file,
        reason: `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`,
      });
      continue;
    }

    if (runningTotal + file.size > MAX_TOTAL_SIZE) {
      errors.push({
        file,
        reason: `Total batch size would exceed ${formatFileSize(MAX_TOTAL_SIZE)}`,
      });
      continue;
    }

    runningTotal += file.size;
    valid.push(file);
  }

  return { valid, errors };
}

export function loadImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}
