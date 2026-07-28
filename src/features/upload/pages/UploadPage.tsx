import { DropZone } from "@/features/upload/components/DropZone";
import { useZipUpload } from "@/features/upload/hooks/useZipUpload";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function UploadPage() {
  const { state, handleFile } = useZipUpload();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink-50">
          See who doesn't follow you back
        </h1>
        <p className="mt-2 text-ink-400">
          Uses your own Instagram data export. No login, no server, no tracking.
        </p>
      </div>

      <DropZone onFileSelected={handleFile} disabled={state.status === "parsing"} />

      {state.status === "parsing" && (
        <p className="text-center text-sm text-ink-400">Reading your export…</p>
      )}
      {state.status === "error" && (
        <Card className="border-signal-lost/40">
          <CardTitle className="text-signal-lost">Couldn't read that export</CardTitle>
          <CardDescription>{state.message}</CardDescription>
        </Card>
      )}

      <Card>
        <CardTitle>How to get your export</CardTitle>
        <CardDescription>
          Instagram settings → Accounts Center → Your information and permissions →
          Download your information → choose JSON format. Download the ZIP and drop
          it above — it's parsed entirely in this browser tab.
        </CardDescription>
      </Card>
    </div>
  );
}
