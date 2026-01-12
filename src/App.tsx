import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { MatchAnalysis } from "./pages/MatchAnalysis";
import { PlayerDevelopment } from "./pages/PlayerDevelopment";
import { LiveCoach } from "./pages/LiveCoach";
import { MotionStudio } from "./pages/MotionStudio";
import { Insights } from "./pages/Insights";
import AIPlayground from "./pages/AIPlayground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* App routes with MainLayout */}
          <Route path="/app" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/app/match" element={<MainLayout><MatchAnalysis /></MainLayout>} />
          <Route path="/app/match/:matchId" element={<MainLayout><MatchAnalysis /></MainLayout>} />
          <Route path="/app/player" element={<MainLayout><PlayerDevelopment /></MainLayout>} />
          <Route path="/app/player/:playerId" element={<MainLayout><PlayerDevelopment /></MainLayout>} />
          <Route path="/app/live" element={<MainLayout><LiveCoach /></MainLayout>} />
          <Route path="/app/motion" element={<MainLayout><MotionStudio /></MainLayout>} />
          <Route path="/app/insights" element={<MainLayout><Insights /></MainLayout>} />
          <Route path="/app/ai-playground" element={<MainLayout><AIPlayground /></MainLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
