"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Github, Star, X } from "lucide-react";
import { Dialog } from "radix-ui";
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

const GITHUB_URL = "https://github.com/Einar-san/openResizer";

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

  const [showEndorseDialog, setShowEndorseDialog] = useState(false);
  const endorseShownRef = useRef(false);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const hasImages = images.length > 0;
  const canResize = hasImages && !isProcessing;

  const handleResize = () => {
    clearResults();
    processImages(images);
  };

  const triggerEndorseOnce = () => {
    if (!endorseShownRef.current) {
      endorseShownRef.current = true;
      setShowEndorseDialog(true);
    }
  };

  const handleDownload = (image: Parameters<typeof downloadImage>[0]) => {
    downloadImage(image);
    triggerEndorseOnce();
  };

  const handleDownloadAll = () => {
    downloadAll();
    triggerEndorseOnce();
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">openResizer</h1>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="View on GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
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
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
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
        <p className="mt-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Github className="h-3 w-3" />
            Open source on GitHub
          </a>
        </p>
      </footer>

      {/* GitHub endorse dialog */}
      <Dialog.Root open={showEndorseDialog} onOpenChange={setShowEndorseDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            <Dialog.Title className="flex items-center gap-2 text-lg font-semibold">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              Enjoying openResizer?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              If this tool saved you time, consider starring it on GitHub — it
              helps a lot!
            </Dialog.Description>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Star on GitHub
                </a>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowEndorseDialog(false)}
              >
                Maybe later
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
