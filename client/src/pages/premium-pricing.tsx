import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Video, Crown, Zap, Infinity, Star, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PremiumHeader from "@/components/premium-header";

export default function PremiumPricing() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (planType: string) => {
    setIsLoading(planType);
    
    try {
      if (planType === 'one-time') {
        navigate("/checkout");
        return;
      } else if (planType === 'test-monthly') {
        navigate("/subscription-direct");
      } else {
        const response = await apiRequest("POST", "/api/create-subscription", {
          planType
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create subscription");
        }
        
        const data = await response.json();
        
        if (data.subscriptionUrl) {
          setIsLoading(null);
          window.location.href = data.subscriptionUrl;
        } else {
          throw new Error("No subscription URL returned");
        }
      }
    } catch (error: any) {
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
      icon: <Sparkles className="h-6 w-6" />,
      badge: "Perfect for Testing",
      features: [
        "10 video generation credits",
        "Up to 10 seconds per video",
        "HD quality output",
        "All video styles",
        "Download & share videos",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      id: "test-monthly",
      name: "Pro Monthly",
      price: "$1",
      period: "per month",
      credits: 100,
      icon: <Crown className="h-6 w-6" />,
      badge: "Most Popular",
      features: [
        "100 video generation credits",
        "Up to 3 minutes per video",
        "4K quality output",
        "All video styles & effects",
        "Priority processing",
        "Advanced customization",
        "Priority support",
        "Commercial license"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "per month",
      credits: "Unlimited",
      icon: <Shield className="h-6 w-6" />,
      badge: "Best Value",
      features: [
        "Unlimited video generation",
        "Up to 10 minutes per video",
        "8K quality output",
        "Custom video styles",
        "API access",
        "White-label solution",
        "Dedicated support",
        "Enterprise license",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Lightning Fast",
      description: "Generate videos in under 2 minutes"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Premium Quality",
      description: "Hollywood-grade video generation"
    },
    {
      icon: <Infinity className="h-5 w-5" />,
      title: "Unlimited Styles",
      description: "Access to all video styles and effects"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />
      
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
            <Crown className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium">Premium AI Video Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your <span className="text-gradient">Creative Plan</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Scale your video creation with our flexible pricing plans. 
            From individual creators to enterprise teams.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="gradient-primary text-white px-4 py-1 text-sm">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <Card className={`card-premium h-full ${plan.popular ? 'ring-2 ring-purple-500/30' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center">
                        <div className="text-white">{plan.icon}</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {typeof plan.credits === 'number' ? `${plan.credits} credits` : plan.credits}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading === plan.id}
                      className={`w-full h-12 ${plan.popular ? 'btn-premium' : 'hover:bg-white/10'}`}
                      variant={plan.buttonVariant}
                    >
                      {isLoading === plan.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">How do credits work?</h3>
                <p className="text-muted-foreground text-sm">
                  Each video generation uses 1 credit, regardless of duration (up to plan limit). 
                  Credits reset monthly for subscription plans.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can cancel your subscription at any time. You'll keep access 
                  until the end of your billing period.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">What video formats are supported?</h3>
                <p className="text-muted-foreground text-sm">
                  We support MP4, WebM, and MOV formats. All videos are generated in 
                  HD quality with options for 4K and 8K on higher plans.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! The Pro Monthly plan includes a free trial period. 
                  No credit card required to start.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 30-day money-back guarantee for all subscription plans. 
                  One-time purchases are non-refundable.
                </p>
              </div>
              
              <div className="card-premium p-6">
                <h3 className="font-semibold mb-2">Need enterprise pricing?</h3>
                <p className="text-muted-foreground text-sm">
                  Contact our sales team for custom enterprise solutions with 
                  volume discounts and dedicated support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="card-premium p-12">
            <Crown className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Creating <span className="text-gradient">Amazing Videos</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators who trust VideoGen AI for their video content
            </p>
            <Button 
              onClick={() => handleSubscribe('test-monthly')} 
              className="btn-premium text-lg px-8 py-4 h-14"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}