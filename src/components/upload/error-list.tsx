"use client";

import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ValidationError } from "@/types";

interface ErrorListProps {
  errors: ValidationError[];
  onDismiss: () => void;
}

export function ErrorList({ errors, onDismiss }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
          <div className="space-y-1">
            {errors.map((error, i) => (
              <p key={i} className="text-sm text-destructive">
                <span className="font-medium">{error.file.name}</span>:{" "}
                {error.reason}
              </p>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onDismiss}
          aria-label="Dismiss errors"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
