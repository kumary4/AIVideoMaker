import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ priceId }: { priceId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/dashboard',
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed!",
      });
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("starter");

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/get-or-create-subscription", { 
      priceId: getPriceId(selectedPlan) 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to create subscription",
          variant: "destructive",
        });
      });
  }, [user, selectedPlan]);

  const getPriceId = (plan: string) => {
    // These would be actual Stripe Price IDs in production
    switch (plan) {
      case 'starter':
        return 'price_starter';
      case 'pro':
        return 'price_pro';
      case 'enterprise':
        return 'price_enterprise';
      default:
        return 'price_starter';
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$19',
      period: 'per month',
      features: [
        '50 video generations',
        '1080p resolution',
        '60-second videos',
        'No watermark',
        'Basic AI voices'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: 'per month',
      features: [
        '200 video generations',
        '4K resolution',
        '2-minute videos',
        'Premium AI voices',
        'Custom branding',
        'Priority support'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Unlimited generations',
        'Custom resolutions',
        'Long-form videos',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">Upgrade to unlock more features and higher limits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-purple-600 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{plan.name}</div>
                  <div className="text-3xl font-bold text-purple-600 mt-2">{plan.price}</div>
                  <div className="text-sm text-gray-600">{plan.period}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {clientSecret && selectedPlan !== 'enterprise' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Complete Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm priceId={getPriceId(selectedPlan)} />
              </Elements>
            </CardContent>
          </Card>
        )}

        {selectedPlan === 'enterprise' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Enterprise Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Contact our sales team to discuss your enterprise needs and get a custom quote.
              </p>
              <Button onClick={() => window.open('mailto:sales@klingai.com')}>
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        )}

        {!clientSecret && selectedPlan !== 'enterprise' && (
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Setting up your subscription...</p>
          </div>
        )}
      </div>
    </div>
  );
}
