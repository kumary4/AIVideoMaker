import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TestStripe() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const createCheckoutSession = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription", {
        planType: "test-monthly"
      });
      
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      
      const data = await response.json();
      setCheckoutUrl(data.subscriptionUrl);
      
      toast({
        title: "Checkout Session Created",
        description: "Click the link below to proceed to payment",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Stripe Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createCheckoutSession}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creating Session..." : "Create Checkout Session"}
          </Button>
          
          {checkoutUrl && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Checkout URL created:</p>
              <div className="bg-gray-100 p-2 rounded text-xs break-all">
                {checkoutUrl}
              </div>
              <Button 
                onClick={() => window.open(checkoutUrl, '_blank')}
                variant="outline"
                className="w-full"
              >
                Open in New Tab
              </Button>
              <Button 
                onClick={() => window.location.href = checkoutUrl}
                className="w-full"
              >
                Go to Checkout (Same Tab)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}