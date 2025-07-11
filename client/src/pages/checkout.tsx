import { useState } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Video, Mail, Lock, Sparkles, Check } from "lucide-react";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/auth-selection`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Your credits have been added to your account!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 font-semibold py-3"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Complete Purchase
          </>
        )}
      </Button>
    </form>
  );
};

const AuthSelectionForm = () => {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/auth/register", { email, password });
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // For now, redirect to manual auth - can be implemented later
    toast({
      title: "Coming Soon",
      description: "Google Sign-In will be available soon. Please use email registration for now.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
          <p className="text-gray-600">Create your account to access your credits</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="google" className="space-y-4">
              <Button 
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Google Sign-In coming soon. Please use email registration above.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [showAuthSelection, setShowAuthSelection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent for 10 credits ($5.00)
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: 5.00,
      credits: 10,
      description: "10 Video Generation Credits"
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (showAuthSelection) {
    return <AuthSelectionForm />;
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Get Video Generation Credits</CardTitle>
          <p className="text-gray-600">Purchase credits to start creating amazing AI videos</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Package Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Starter Package</h3>
                <div className="text-3xl font-bold mb-2">$5.00</div>
                <p className="text-purple-100 mb-4">Perfect for getting started</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>10 video generation credits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Up to 10 seconds per video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>HD quality output</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>All video styles included</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">How it works:</p>
                <ul className="space-y-1 text-sm">
                  <li>• 1 credit = 1 video up to 5 seconds</li>
                  <li>• 2 credits = 1 video up to 10 seconds</li>
                  <li>• Download and share your videos</li>
                </ul>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={() => setShowAuthSelection(true)} />
              </Elements>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}