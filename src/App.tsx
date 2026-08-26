import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initAutoTracking } from "@/lib/track";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import AuthPage from "./pages/auth/AuthPage";
import RoleSelect from "./pages/onboarding/RoleSelect";
import ManagerOnboarding from "./pages/onboarding/ManagerOnboarding";
import EmployeeOnboarding from "./pages/onboarding/EmployeeOnboarding";
import AppShell from "./components/app/AppShell";
import EmployeeDashboard from "./pages/employee/Dashboard";
import TeamsPage from "./pages/employee/Teams";
import SettingsPage from "./pages/employee/Settings";
import FeaturesPage from "./pages/employee/Features";
import PrivacyInfo from "./pages/employee/PrivacyInfo";
import ManagerShell from "./components/app/ManagerShell";
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerTeamsCombined from "./pages/manager/TeamsCombined";
import ManagerSettingsCombined from "./pages/manager/SettingsCombined";
import ManagerMembers from "./pages/manager/Members";
import ManagerInvites from "./pages/manager/Invites";
import ManagerChallenges from "./pages/manager/Challenges";
import ManagerRules from "./pages/manager/Rules";
import EmployeeRules from "./pages/employee/Rules";
import ProtectedRoute from "./components/app/ProtectedRoute";
import NotFound from "./pages/NotFound";
import JoinByCode from "./pages/JoinByCode";
import DemoEmployee from "./pages/demo/DemoEmployee";
import DemoManager from "./pages/demo/DemoManager";
import Waitlist from "./pages/Waitlist";
import Trust from "./pages/Trust";
import Akzeptanz from "./pages/Akzeptanz";
import Vorteile from "./pages/Vorteile";
import Impressum from "./pages/Impressum";
import Unsubscribe from "./pages/Unsubscribe";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import OAuthConsent from "./pages/OAuthConsent";

const queryClient = new QueryClient();

function TrackingProvider() {
  useEffect(() => initAutoTracking(), []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingProvider />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/join/:code" element={<JoinByCode />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

          {/* Public demo (no auth) */}
          <Route path="/demo/employee" element={<DemoEmployee />} />
          <Route path="/demo/manager" element={<DemoManager />} />

          {/* Waitlist (public) */}
          <Route path="/waitlist" element={<Waitlist />} />

          {/* Öffentliche Informationsarchitektur (kanonische URLs) */}
          <Route path="/fuer-mitarbeitende" element={<Vorteile />} />
          <Route path="/fuer-arbeitgeber" element={<Arbeitgeber />} />
          <Route path="/fuer-betriebsrat" element={<Akzeptanz />} />
          <Route path="/datenschutz" element={<Trust />} />
          <Route path="/einfuehrung" element={<Einfuehrung />} />

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

          <Route path="/app" element={<ProtectedRoute requireRole="employee"><AppShell /></ProtectedRoute>}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="stats" element={<Navigate to="/app" replace />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="rules" element={<EmployeeRules />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="privacy" element={<PrivacyInfo />} />
          </Route>

          <Route path="/manager" element={<ProtectedRoute requireRole="manager"><ManagerShell /></ProtectedRoute>}>
            <Route index element={<ManagerDashboard />} />
            <Route path="teams" element={<ManagerTeamsCombined />} />
            <Route path="members" element={<ManagerMembers />} />
            <Route path="invites" element={<ManagerInvites />} />
            <Route path="challenges" element={<ManagerChallenges />} />
            <Route path="leads" element={<Navigate to="/admin/leads" replace />} />
            <Route path="rules" element={<ManagerRules />} />
            <Route path="settings" element={<ManagerSettingsCombined />} />
          </Route>

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
