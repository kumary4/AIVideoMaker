import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Video, Crown } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (planType: string) => {
    setIsLoading(planType);
    
    try {
      if (planType === 'one-time') {
        // Redirect to existing checkout for one-time purchase
        navigate("/checkout");
        return;
      } else {
        // Create subscription
        console.log('Creating subscription for plan:', planType);
        
        const response = await apiRequest("POST", "/api/create-subscription", {
          planType
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create subscription");
        }
        
        const data = await response.json();
        console.log('Subscription response:', data);
        
        if (data.subscriptionUrl) {
          console.log('Redirecting to Stripe checkout:', data.subscriptionUrl);
          // Clear loading state before redirect
          setIsLoading(null);
          // Use window.location.href for full redirect
          window.location.href = data.subscriptionUrl;
        } else {
          throw new Error("No subscription URL returned");
        }
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      setIsLoading(null);
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    }
  };

  const plans = [
    {
      id: "one-time",
      name: "Starter Pack",
      price: "$5",
      period: "one-time",
      credits: 10,
      features: [
        "10 video generation credits",
        "Up to 10 seconds per video",
        "HD quality output",
        "All video styles",
        "Download & share videos",
        "Email support"
      ],
      buttonText: "Buy Credits",
      buttonVariant: "outline" as const,
      popular: false,
      description: "Perfect for trying out AI video generation"
    },
    {
      id: "test-monthly",
      name: "Test Monthly",
      price: "$1",
      period: "per month",
      credits: 1,
      features: [
        "1 video generation credit monthly",
        "Up to 10 seconds per video",
        "HD quality output",
        "All video styles",
        "Download & share videos",
        "Email support",
        "Cancel anytime"
      ],
      buttonText: "Start Test Plan",
      buttonVariant: "default" as const,
      popular: true,
      description: "Testing subscription - will be removed later",
      badge: "TEST ONLY"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your AI video generation needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden ${
                plan.popular 
                  ? "border-2 border-purple-500 shadow-xl" 
                  : "border shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2">
                  <span className="font-semibold">Most Popular</span>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? "pt-16" : "pt-8"}`}>
                <div className="flex justify-center mb-4">
                  {plan.id === "test-monthly" ? (
                    <Crown className="w-12 h-12 text-purple-600" />
                  ) : (
                    <Video className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  {plan.badge && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">
                      {plan.credits} Credit{plan.credits !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    {plan.id === "test-monthly" ? "Monthly allowance" : "Total credits"}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  variant={plan.buttonVariant}
                  className={`w-full py-3 font-semibold ${
                    plan.buttonVariant === "default"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                      : "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  }`}
                  disabled={isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-600">
            All plans include HD quality videos, all styles, and email support
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>✓ Secure payment with Stripe</span>
            <span>✓ Cancel anytime</span>
            <span>✓ No hidden fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}