"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ImageFile,
  ResizeOptions,
  ProcessedImage,
  ProcessingProgress,
} from "@/types";
import { DEFAULT_RESIZE_OPTIONS } from "@/lib/constants";
import { computeOutputDimensions, getOutputFileName } from "@/lib/resizer/resize";
import { resizeWithWorker, terminateWorker } from "@/lib/resizer/worker-client";

export function useResizer() {
  const [options, setOptions] = useState<ResizeOptions>(DEFAULT_RESIZE_OPTIONS);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState<Map<string, ProcessingProgress>>(
    new Map()
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref to track results for cleanup without causing dependency cycles
  const resultsRef = useRef(results);
  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const updateOptions = useCallback((partial: Partial<ResizeOptions>) => {
    setOptions((prev) => ({ ...prev, ...partial }));
  }, []);

  const processImages = useCallback(async (images: ImageFile[]) => {
    if (images.length === 0) return;

    const currentOptions = optionsRef.current;

    setIsProcessing(true);
    setResults([]);

    const progressMap = new Map<string, ProcessingProgress>();
    images.forEach((img) =>
      progressMap.set(img.id, {
        imageId: img.id,
        status: "processing",
        progress: 0,
      })
    );
    setProgress(new Map(progressMap));

    for (const image of images) {
      try {
        const { width, height } = computeOutputDimensions(image, currentOptions);
        const imageBitmap = await createImageBitmap(image.file);

        const result = await resizeWithWorker(imageBitmap, image.id, {
          width,
          height,
          format: currentOptions.outputFormat,
          quality: currentOptions.quality,
        });

        if (result.type === "error") {
          progressMap.set(image.id, {
            imageId: image.id,
            status: "error",
            progress: 0,
            error: result.error,
          });
          setProgress(new Map(progressMap));
          continue;
        }

        if (result.blob) {
          const previewUrl = URL.createObjectURL(result.blob);
          const processedImage: ProcessedImage = {
            id: crypto.randomUUID(),
            sourceId: image.id,
            blob: result.blob,
            name: getOutputFileName(image.name, currentOptions.outputFormat),
            width: result.width ?? width,
            height: result.height ?? height,
            size: result.blob.size,
            format: currentOptions.outputFormat,
            previewUrl,
          };

          setResults((prev) => [...prev, processedImage]);
        }

        progressMap.set(image.id, {
          imageId: image.id,
          status: "done",
          progress: 100,
        });
        setProgress(new Map(progressMap));
      } catch (err) {
        progressMap.set(image.id, {
          imageId: image.id,
          status: "error",
          progress: 0,
          error: err instanceof Error ? err.message : "Processing failed",
        });
        setProgress(new Map(progressMap));
      }
    }

    setIsProcessing(false);
  }, []);

  const downloadImage = useCallback((processed: ProcessedImage) => {
    const a = document.createElement("a");
    a.href = processed.previewUrl;
    a.download = processed.name;
    a.click();
  }, []);

  const downloadAll = useCallback(() => {
    const current = resultsRef.current;
    if (current.length === 0) return;

    const download = async () => {
      for (const result of current) {
        const a = document.createElement("a");
        a.href = result.previewUrl;
        a.download = result.name;
        a.click();
        if (current.length > 1) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    };
    download();
  }, []);

  const clearResults = useCallback(() => {
    resultsRef.current.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setResults([]);
    setProgress(new Map());
  }, []);

  const cleanup = useCallback(() => {
    clearResults();
    terminateWorker();
  }, [clearResults]);

  return {
    options,
    updateOptions,
    results,
    progress,
    isProcessing,
    processImages,
    downloadImage,
    downloadAll,
    clearResults,
    cleanup,
  };
}
