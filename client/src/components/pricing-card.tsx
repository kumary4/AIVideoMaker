import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular?: boolean;
}

export default function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  buttonText, 
  buttonVariant,
  popular = false 
}: PricingCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    if (name === "Free") {
      // Handle free plan signup
      navigate('/');
    } else if (name === "Enterprise") {
      // Handle enterprise contact
      window.open('mailto:sales@klingai.com');
    } else {
      // Handle paid plan subscription
      navigate('/subscribe');
    }
  };

  return (
    <Card className={`relative hover:shadow-lg transition-shadow ${popular ? 'border-2 border-purple-600' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-purple-600 text-white">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <CardTitle>
          <div className="text-xl font-semibold text-gray-900 mb-2">{name}</div>
          <div className="text-3xl font-bold text-gray-900">{price}</div>
          <div className="text-sm text-gray-600">{period}</div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          onClick={handleClick}
          variant={buttonVariant}
          className={`w-full font-medium ${
            buttonVariant === "default" 
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white" 
              : ""
          }`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
