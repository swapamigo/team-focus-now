import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAutoTracking } from "@/lib/track";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import FocusInfo from "./pages/FocusInfo";
import CompanySuggestion from "./pages/CompanySuggestion";
const FocusEmployee = lazy(() => import("./pages/employee/FocusEmployee"));
const FocusManager = lazy(() => import("./pages/manager/FocusManager"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));
const RoleSelect = lazy(() => import("./pages/onboarding/RoleSelect"));
const ManagerOnboarding = lazy(() => import("./pages/onboarding/ManagerOnboarding"));
const EmployeeOnboarding = lazy(() => import("./pages/onboarding/EmployeeOnboarding"));
import ProtectedRoute from "./components/app/ProtectedRoute";
import NotFound from "./pages/NotFound";
import JoinByCode from "./pages/JoinByCode";
const DemoEmployee = lazy(() => import("./pages/demo/DemoEmployee"));
const DemoManager = lazy(() => import("./pages/demo/DemoManager"));
import Impressum from "./pages/Impressum";
import Unsubscribe from "./pages/Unsubscribe";


const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

function TrackingProvider() {
  const { pathname } = useLocation();
  useEffect(() => { if (!window.location.hash) window.scrollTo(0, 0); return initAutoTracking(); }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingProvider />
        <Suspense fallback={<div className="min-h-screen grid place-items-center" role="status">TeamFokus …</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/join/:code" element={<JoinByCode />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

          {/* Public demo (no auth) */}
          <Route path="/demo/employee/*" element={<DemoEmployee />} />
          <Route path="/demo/manager/*" element={<DemoManager />} />

          {/* Waitlist (public) */}
          <Route path="/waitlist" element={<CompanySuggestion />} />
          <Route path="/unternehmen-vorschlagen" element={<CompanySuggestion />} />

          {/* Öffentliche Informationsarchitektur (kanonische URLs) */}
          <Route path="/fuer-mitarbeitende" element={<FocusInfo />} />
          <Route path="/fuer-arbeitgeber" element={<FocusInfo />} />
          <Route path="/fuer-betriebsrat" element={<FocusInfo />} />
          <Route path="/datenschutz" element={<FocusInfo />} />
          <Route path="/einfuehrung" element={<FocusInfo />} />

          {/* Alte URLs → Weiterleitung auf die kanonische Seite */}
          <Route path="/vorteile" element={<Navigate to="/fuer-mitarbeitende" replace />} />
          <Route path="/akzeptanz" element={<Navigate to="/fuer-betriebsrat" replace />} />
          <Route path="/betriebsrat" element={<Navigate to="/fuer-betriebsrat" replace />} />
          <Route path="/datenschutz-by-design" element={<Navigate to="/datenschutz" replace />} />
          <Route path="/trust" element={<Navigate to="/datenschutz" replace />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/checkout" element={<Navigate to="/waitlist" replace />} />
          <Route path="/checkout/success" element={<Navigate to="/waitlist" replace />} />


          <Route path="/onboarding/role" element={<ProtectedRoute requireOnboarded={false}><RoleSelect /></ProtectedRoute>} />
          <Route path="/onboarding/manager" element={<ProtectedRoute requireOnboarded={false}><ManagerOnboarding /></ProtectedRoute>} />
          <Route path="/onboarding/employee" element={<ProtectedRoute requireOnboarded={false}><EmployeeOnboarding /></ProtectedRoute>} />

          <Route path="/app/stats" element={<Navigate to="/app/progress" replace />} />
          <Route path="/app/teams" element={<Navigate to="/app/ranking" replace />} />
          <Route path="/app/privacy" element={<Navigate to="/datenschutz" replace />} />
          <Route path="/app/*" element={<ProtectedRoute requireRole="employee"><FocusEmployee /></ProtectedRoute>} />
          <Route path="/manager/teams" element={<Navigate to="/manager" replace />} />
          <Route path="/manager/members" element={<Navigate to="/manager" replace />} />
          <Route path="/manager/challenges" element={<Navigate to="/manager/rewards" replace />} />
          <Route path="/manager/leads" element={<Navigate to="/admin/leads" replace />} />
          <Route path="/manager/*" element={<ProtectedRoute requireRole="manager"><FocusManager /></ProtectedRoute>} />

          {/* Admin-only area (separate shell, no employee/manager nav) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/leads" replace />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
