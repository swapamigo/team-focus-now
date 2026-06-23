import { Outlet, useLocation } from "react-router-dom";
import MobileNav from "@/components/app/MobileNav";
import OnboardingTour from "@/components/app/OnboardingTour";
import PrivacyBadge from "@/components/app/PrivacyBadge";

export default function AppShell() {
  const loc = useLocation();
  const hideBadge = loc.pathname === "/app/privacy";
  return (
    <div className="min-h-screen bg-background mx-auto max-w-md md:max-w-lg lg:max-w-xl border-x border-border/40">
      {!hideBadge && <PrivacyBadge />}
      <Outlet />
      <MobileNav />
      <OnboardingTour />
    </div>
  );
}
