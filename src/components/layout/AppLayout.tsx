import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";

/**
 * Shared shell for every route. Feature pages render inside <Outlet/> and
 * should not re-implement page chrome (header, max-width, padding).
 */
export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
