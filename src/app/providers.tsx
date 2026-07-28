import type { PropsWithChildren } from "react";

/**
 * Single place to stack app-wide providers (theme, query client, i18n,
 * plugin host, etc.) as the project grows. V1 has nothing to provide yet
 * beyond routing, so this is a pass-through — but every future cross-
 * cutting concern (see FUTURE FEATURES in the README) should register here
 * instead of wrapping <App /> ad hoc.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return <>{children}</>;
}
