import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Subscribe from "@/pages/subscribe";
import Checkout from "@/pages/checkout";
import AuthSelection from "@/pages/auth-selection";
import Pricing from "@/pages/pricing";
import SubscriptionSuccess from "@/pages/subscription-success";
import TestStripe from "@/pages/test-stripe";
import SubscriptionDirect from "@/pages/subscription-direct";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/auth-selection" component={AuthSelection} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/subscription-success" component={SubscriptionSuccess} />
      <Route path="/test-stripe" component={TestStripe} />
      <Route path="/subscription-direct" component={SubscriptionDirect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;