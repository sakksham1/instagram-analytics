import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseInstagramExport } from "@/parser/detectors/detectExportVersion";
import { useExportStore } from "@/app/exportStore";

type UploadState =
  | { status: "idle" }
  | { status: "parsing" }
  | { status: "error"; message: string };

/**
 * Owns the upload -> parse -> navigate flow. Kept in the `upload` feature
 * (not in a shared hook) because this exact orchestration — what happens
 * right after a file is dropped — is specific to this one screen.
 */
export function useZipUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const setParsedExport = useExportStore((s) => s.setParsedExport);
  const navigate = useNavigate();

  const handleFile = useCallback(
    async (file: File) => {
      setState({ status: "parsing" });
      try {
        const parsed = await parseInstagramExport(file);
        setParsedExport(parsed, file);
        navigate("/wrapped");
      } catch (err) {
        setState({
          status: "error",
          message:
            err instanceof Error
              ? err.message
              : "Something went wrong reading that file.",
        });
      }
    },
    [navigate, setParsedExport],
  );

  return { state, handleFile };
}
