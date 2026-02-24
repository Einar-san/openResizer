"use client";

import { useEffect } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropZone } from "@/components/upload/drop-zone";
import { ImageThumbnail } from "@/components/upload/image-thumbnail";
import { ErrorList } from "@/components/upload/error-list";
import { ResizeControls } from "@/components/resize/resize-controls";
import { ResultsPanel } from "@/components/output/results-panel";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useResizer } from "@/hooks/use-resizer";
import { MAX_BATCH_SIZE } from "@/lib/constants";

export default function Home() {
  const {
    images,
    errors,
    isLoading,
    addFiles,
    removeImage,
    clearAll,
    dismissErrors,
  } = useFileUpload();

  const {
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
  } = useResizer();

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const hasImages = images.length > 0;
  const canResize = hasImages && !isProcessing;

  const handleResize = () => {
    clearResults();
    processImages(images);
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">openResizer</h1>
        </div>
        <p className="text-muted-foreground">
          Resize images directly in your browser. Private, fast, free.
        </p>
      </header>

      <div className="space-y-8">
        {/* Upload section */}
        <section>
          <DropZone
            onFilesSelected={addFiles}
            disabled={isLoading || images.length >= MAX_BATCH_SIZE}
          />

          <ErrorList errors={errors} onDismiss={dismissErrors} />

          {hasImages && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {images.length} / {MAX_BATCH_SIZE} images
                </p>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              {images.map((image) => (
                <ImageThumbnail
                  key={image.id}
                  image={image}
                  onRemove={removeImage}
                />
              ))}
            </div>
          )}
        </section>

        {/* Resize controls */}
        {hasImages && (
          <section>
            <Separator className="mb-6" />
            <h2 className="mb-4 text-lg font-semibold">Resize Options</h2>
            <ResizeControls
              options={options}
              onUpdate={updateOptions}
              images={images}
            />

            <div className="mt-6">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleResize}
                disabled={!canResize}
              >
                {isProcessing ? "Processing..." : "Resize Images"}
              </Button>
            </div>
          </section>
        )}

        {/* Results */}
        {(results.length > 0 || progress.size > 0) && (
          <section>
            <Separator className="mb-6" />
            <ResultsPanel
              results={results}
              progress={progress}
              isProcessing={isProcessing}
              onDownload={downloadImage}
              onDownloadAll={downloadAll}
            />
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-center text-xs text-muted-foreground">
        <p>
          All processing happens in your browser. No images are uploaded to any
          server.
        </p>
      </footer>
    </div>
  );
}
