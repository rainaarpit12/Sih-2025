import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import FarmerSignup from "./pages/FarmerSignup";
import DistributorSignup from "./pages/DistributorSignup";
import RetailerSignup from "./pages/RetailerSignup";
import CustomerSignup from "./pages/CustomerSignup";
import NotFound from "./pages/NotFound";
import AccountSelector from "./components/AccountSelector";

import TranslateWidget from "./components/ui/TranslateWidget";
import Chatbot from "./components/ui/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Account Selector - temporarily hidden to avoid UI interference */}
          {/* <div className="fixed top-4 right-4 z-50 max-w-sm">
            <AccountSelector />
          </div> */}
          
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
            <Route path="/distributor-dashboard" element={<DistributorDashboard />} />
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/farmer-signup" element={<FarmerSignup />} />
            <Route path="/distributor-signup" element={<DistributorSignup />} />
            <Route path="/retailer-signup" element={<RetailerSignup />} />
            <Route path="/customer-signup" element={<CustomerSignup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <TranslateWidget/>
          <Chatbot/>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
