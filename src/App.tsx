import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";

/**
 * Composition root. Kept intentionally thin: providers wrap the app,
 * the router decides what's on screen. Nothing feature-specific lives here.
 */
export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
