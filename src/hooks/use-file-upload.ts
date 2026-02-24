"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ImageFile, ValidationError } from "@/types";
import { validateFiles, loadImageDimensions } from "@/lib/resizer/validation";

export function useFileUpload() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to read current images without causing callback re-creation
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const addFiles = useCallback(async (files: File[]) => {
    const current = imagesRef.current;
    const existingTotalSize = current.reduce((sum, img) => sum + img.size, 0);
    const { valid, errors: validationErrors } = validateFiles(
      files,
      current.length,
      existingTotalSize
    );

    setErrors(validationErrors);

    if (valid.length === 0) return;

    setIsLoading(true);

    const newImages: ImageFile[] = [];

    for (const file of valid) {
      try {
        const { width, height } = await loadImageDimensions(file);
        const previewUrl = URL.createObjectURL(file);

        newImages.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          originalWidth: width,
          originalHeight: height,
          previewUrl,
        });
      } catch {
        setErrors((prev) => [
          ...prev,
          { file, reason: "Failed to load image" },
        ]);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsLoading(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setErrors([]);
  }, []);

  const dismissErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    images,
    errors,
    isLoading,
    addFiles,
    removeImage,
    clearAll,
    dismissErrors,
  };
}
