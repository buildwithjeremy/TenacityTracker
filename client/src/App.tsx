import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/hooks/use-app-state";

// Pages
import AuthPage from "@/pages/auth";
import RoleSelectorPage from "@/pages/role-selector";
import TrainerDashboard from "@/pages/trainer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import RepChecklistPage from "@/pages/rep-checklist";

// Layout Components
import TopNav from "@/components/navigation/top-nav";
import BottomNav from "@/components/navigation/bottom-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/role-selector" component={RoleSelectorPage} />
      <Route path="/trainer-dashboard" component={TrainerDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/rep/:id" component={RepChecklistPage} />
      <Route component={AuthPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <div className="min-h-screen bg-gray-50">
            <Router />
            <Toaster />
          </div>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
