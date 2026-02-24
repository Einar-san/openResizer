"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatFileSize } from "@/lib/utils";
import type { ProcessedImage, ProcessingProgress } from "@/types";

interface ResultsPanelProps {
  results: ProcessedImage[];
  progress: Map<string, ProcessingProgress>;
  isProcessing: boolean;
  onDownload: (image: ProcessedImage) => void;
  onDownloadAll: () => void;
}

export function ResultsPanel({
  results,
  progress,
  isProcessing,
  onDownload,
  onDownloadAll,
}: ResultsPanelProps) {
  const progressEntries = Array.from(progress.values());
  const hasErrors = progressEntries.some((p) => p.status === "error");

  if (progressEntries.length === 0 && results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Results</h2>
        {results.length > 1 && !isProcessing && (
          <Button onClick={onDownloadAll} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        )}
      </div>

      <Separator />

      {/* Processing indicators */}
      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing images...</span>
        </div>
      )}

      {/* Error messages */}
      {hasErrors &&
        progressEntries
          .filter((p) => p.status === "error")
          .map((p) => (
            <p key={p.imageId} className="text-sm text-destructive">
              Error: {p.error}
            </p>
          ))}

      {/* Results grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <div
            key={result.id}
            className="group overflow-hidden rounded-lg border bg-card"
          >
            <div className="relative aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.previewUrl}
                alt={result.name}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="p-3">
              <p className="truncate text-sm font-medium">{result.name}</p>
              <p className="text-xs text-muted-foreground">
                {result.width} × {result.height} &middot;{" "}
                {formatFileSize(result.size)}
              </p>

              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => onDownload(result)}
              >
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
