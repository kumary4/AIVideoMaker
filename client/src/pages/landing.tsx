import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DynamicHero from "@/components/dynamic-hero";
import VideoShowcaseGallery from "@/components/video-showcase-gallery";
import { 
  Sparkles, 
  Play, 
  Users, 
  Zap, 
  Shield, 
  Crown,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Video,
  Brain,
  Palette,
  Clock
} from "lucide-react";

export default function Landing() {
  const [, navigate] = useLocation();
  const [selectedShowcaseVideo, setSelectedShowcaseVideo] = useState<any>(null);

  const handleStartCreating = () => {
    navigate("/pricing");
  };

  const handleVideoSelect = (video: any) => {
    setSelectedShowcaseVideo(video);
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Advanced AI Models",
      description: "Access to Kling AI, Runway ML, and other cutting-edge video generation models",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from hundreds of pre-made templates for any industry or style",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Styling",
      description: "Complete control over visual style, aspect ratio, and video duration",
      gradient: "from-cyan-500 to-green-500"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Fast Generation",
      description: "Generate professional videos in seconds, not hours",
      gradient: "from-green-500 to-yellow-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together with your team on video projects and share resources",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Ready",
      description: "Secure, scalable solution for businesses of all sizes",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      avatar: "/avatars/sarah.jpg",
      content: "This platform has revolutionized our video marketing. We create professional content in minutes instead of days.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Content Creator",
      company: "Creative Studios",
      avatar: "/avatars/michael.jpg",
      content: "The AI models are incredibly advanced. The quality of generated videos rivals professional production.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Social Media Manager",
      company: "Brand Agency",
      avatar: "/avatars/lisa.jpg",
      content: "Perfect for social media content. The vertical format templates are exactly what we needed.",
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      description: "Perfect for individuals and small projects",
      features: [
        "50 video generations per month",
        "Basic AI models",
        "Standard templates",
        "HD video quality",
        "Email support"
      ],
      buttonText: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "month",
      description: "Best for growing businesses and teams",
      features: [
        "200 video generations per month",
        "Premium AI models",
        "Advanced templates",
        "4K video quality",
        "Team collaboration",
        "Priority support"
      ],
      buttonText: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "month",
      description: "For large teams and organizations",
      features: [
        "Unlimited video generations",
        "All AI models",
        "Custom templates",
        "8K video quality",
        "Advanced team features",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Hero Section */}
      <DynamicHero onStartCreating={handleStartCreating} />

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for Video Creation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to make video creation accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <Play className="h-3 w-3 mr-1" />
              Showcase
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              See What Our Community Creates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore amazing videos created by our users using AI
            </p>
          </div>

          <VideoShowcaseGallery
            onVideoSelect={handleVideoSelect}
            maxVideos={8}
            showControls={true}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`glass relative ${
                  tier.popular ? 'ring-2 ring-primary border-primary/20' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                  <p className="text-muted-foreground">{tier.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : ''
                    }`}
                    onClick={handleStartCreating}
                  >
                    {tier.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of creators who are already using AI to bring their visions to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={handleStartCreating}
            >
              <Video className="h-5 w-5 mr-2" />
              Start Creating Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}