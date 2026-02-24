"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Link, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  OUTPUT_FORMATS,
  RESIZE_PRESETS,
  PERCENTAGE_OPTIONS,
} from "@/lib/constants";
import type { ImageFile, ResizeMode, ResizeOptions, OutputFormat } from "@/types";

interface ResizeControlsProps {
  options: ResizeOptions;
  onUpdate: (partial: Partial<ResizeOptions>) => void;
  images: ImageFile[];
}

export function ResizeControls({
  options,
  onUpdate,
  images,
}: ResizeControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const firstImage = images[0];

  const handleModeChange = (mode: ResizeMode) => {
    onUpdate({ mode });
    if (mode === "dimensions" && firstImage) {
      onUpdate({
        mode,
        width: firstImage.originalWidth,
        height: firstImage.originalHeight,
      });
    } else if (mode === "percentage") {
      onUpdate({ mode, percentage: 100 });
    }
  };

  const handleWidthChange = (value: string) => {
    const width = parseInt(value) || 0;
    if (options.maintainAspectRatio && firstImage) {
      const ratio = firstImage.originalWidth / firstImage.originalHeight;
      onUpdate({ width, height: Math.round(width / ratio) });
    } else {
      onUpdate({ width });
    }
  };

  const handleHeightChange = (value: string) => {
    const height = parseInt(value) || 0;
    if (options.maintainAspectRatio && firstImage) {
      const ratio = firstImage.originalWidth / firstImage.originalHeight;
      onUpdate({ height, width: Math.round(height * ratio) });
    } else {
      onUpdate({ height });
    }
  };

  const presetsByCategory = RESIZE_PRESETS.reduce(
    (acc, preset) => {
      if (!acc[preset.category]) acc[preset.category] = [];
      acc[preset.category].push(preset);
      return acc;
    },
    {} as Record<string, typeof RESIZE_PRESETS>
  );

  const isLossyFormat = options.outputFormat !== "image/png";

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="space-y-2">
        <Label>Resize Mode</Label>
        <div className="grid grid-cols-3 gap-2">
          {(["dimensions", "percentage", "preset"] as ResizeMode[]).map(
            (mode) => (
              <Button
                key={mode}
                variant={options.mode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            )
          )}
        </div>
      </div>

      <Separator />

      {/* Dimensions mode */}
      {options.mode === "dimensions" && (
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <input
                id="width"
                type="number"
                min={1}
                value={options.width || ""}
                onChange={(e) => handleWidthChange(e.target.value)}
                placeholder={firstImage?.originalWidth.toString()}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="mb-0.5 h-9 w-9 shrink-0"
              onClick={() =>
                onUpdate({ maintainAspectRatio: !options.maintainAspectRatio })
              }
              aria-label={
                options.maintainAspectRatio
                  ? "Unlock aspect ratio"
                  : "Lock aspect ratio"
              }
            >
              {options.maintainAspectRatio ? (
                <Link className="h-4 w-4" />
              ) : (
                <Unlink className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1 space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <input
                id="height"
                type="number"
                min={1}
                value={options.height || ""}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder={firstImage?.originalHeight.toString()}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
      )}

      {/* Percentage mode */}
      {options.mode === "percentage" && (
        <div className="space-y-3">
          <Label>Scale: {options.percentage}%</Label>
          <div className="flex flex-wrap gap-2">
            {PERCENTAGE_OPTIONS.map((pct) => (
              <Button
                key={pct}
                variant={options.percentage === pct ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdate({ percentage: pct })}
              >
                {pct}%
              </Button>
            ))}
          </div>
          <Slider
            value={[options.percentage]}
            onValueChange={([v]) => onUpdate({ percentage: v })}
            min={1}
            max={300}
            step={1}
          />
        </div>
      )}

      {/* Preset mode */}
      {options.mode === "preset" && (
        <div className="space-y-3">
          {Object.entries(presetsByCategory).map(([category, presets]) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={
                      options.preset?.label === preset.label
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => onUpdate({ preset })}
                  >
                    {preset.label}
                    <span className="ml-1 text-xs opacity-60">
                      {preset.width}×{preset.height}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Format selector - always visible */}
      <div className="space-y-2">
        <Label>Output Format</Label>
        <Select
          value={options.outputFormat}
          onValueChange={(v) => onUpdate({ outputFormat: v as OutputFormat })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OUTPUT_FORMATS.map((fmt) => (
              <SelectItem key={fmt.value} value={fmt.value}>
                {fmt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>Advanced Options</span>
        {showAdvanced ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Advanced options */}
      {showAdvanced && (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          {isLossyFormat && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-sm text-muted-foreground">
                  {options.quality}%
                </span>
              </div>
              <Slider
                value={[options.quality]}
                onValueChange={([v]) => onUpdate({ quality: v })}
                min={1}
                max={100}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {!isLossyFormat && (
            <p className="text-sm text-muted-foreground">
              PNG is lossless — quality setting does not apply.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
