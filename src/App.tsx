import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import StatsPage from "./pages/employee/Stats";
import TeamsPage from "./pages/employee/Teams";
import NotificationsPage from "./pages/employee/Notifications";
import SettingsPage from "./pages/employee/Settings";
import ManagerShell from "./components/app/ManagerShell";
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerTeams from "./pages/manager/Teams";
import ManagerMembers from "./pages/manager/Members";
import ManagerInvites from "./pages/manager/Invites";
import ManagerChallenges from "./pages/manager/Challenges";
import ManagerSettings from "./pages/manager/Settings";
import ProtectedRoute from "./components/app/ProtectedRoute";
import NotFound from "./pages/NotFound";
import JoinByCode from "./pages/JoinByCode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/join/:code" element={<JoinByCode />} />

          <Route path="/onboarding/role" element={<ProtectedRoute requireOnboarded={false}><RoleSelect /></ProtectedRoute>} />
          <Route path="/onboarding/manager" element={<ProtectedRoute requireOnboarded={false}><ManagerOnboarding /></ProtectedRoute>} />
          <Route path="/onboarding/employee" element={<ProtectedRoute requireOnboarded={false}><EmployeeOnboarding /></ProtectedRoute>} />

          <Route path="/app" element={<ProtectedRoute requireRole="employee"><AppShell /></ProtectedRoute>}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/manager" element={<ProtectedRoute requireRole="manager"><ManagerShell /></ProtectedRoute>}>
            <Route index element={<ManagerDashboard />} />
            <Route path="teams" element={<ManagerTeams />} />
            <Route path="members" element={<ManagerMembers />} />
            <Route path="invites" element={<ManagerInvites />} />
            <Route path="challenges" element={<ManagerChallenges />} />
            <Route path="settings" element={<ManagerSettings />} />
          </Route>

          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
