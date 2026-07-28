import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadPage } from "@/features/upload/pages/UploadPage";
import { FollowerAnalysisPage } from "@/features/follower-analysis/pages/FollowerAnalysisPage";

/**
 * HashRouter is used deliberately: this app can be opened as a static file
 * (file://) or hosted on any static host with zero server config, which
 * matters for a "no backend, runs entirely in your browser" tool.
 *
 * Add new top-level routes here as feature modules land. Each route should
 * point at a page component owned by that feature (see
 * src/features/<name>/pages), not at logic defined inline.
 */
export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/analysis" element={<FollowerAnalysisPage />} />
          {/* TODO(future): /growth, /timeline, /compare, /settings, etc. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
