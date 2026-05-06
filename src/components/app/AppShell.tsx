import { Outlet } from "react-router-dom";
import MobileNav from "@/components/app/MobileNav";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background mx-auto max-w-md md:max-w-lg lg:max-w-xl border-x border-border/40">
      <Outlet />
      <MobileNav />
    </div>
  );
}
