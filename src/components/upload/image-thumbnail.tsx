"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import type { ImageFile } from "@/types";

interface ImageThumbnailProps {
  image: ImageFile;
  onRemove: (id: string) => void;
}

export function ImageThumbnail({ image, onRemove }: ImageThumbnailProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-lg border bg-card p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.previewUrl}
          alt={image.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{image.name}</p>
        <p className="text-xs text-muted-foreground">
          {image.originalWidth} × {image.originalHeight} &middot;{" "}
          {formatFileSize(image.size)}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onRemove(image.id)}
        aria-label={`Remove ${image.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
