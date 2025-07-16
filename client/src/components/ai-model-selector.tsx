import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Clock, 
  Zap, 
  Crown, 
  Star, 
  TrendingUp, 
  Shield,
  Cpu,
  Gauge,
  CheckCircle,
  Info,
  Rocket,
  Brain,
  Video,
  Image,
  Film
} from "lucide-react";

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  userSubscription?: string;
}

export default function AIModelSelector({ selectedModel, onModelChange, userSubscription = "free" }: AIModelSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const aiModels = [
    {
      id: "kling",
      name: "Kling AI",
      provider: "Kuaishou",
      category: "premium",
      description: "Most advanced AI video generation with photorealistic results",
      features: ["Up to 10s videos", "4K resolution", "Photorealistic", "Advanced physics"],
      pricing: { creditsPerSecond: 0.5, costPerCredit: 0.13 },
      maxDuration: 10,
      resolutions: ["1080p", "4K"],
      rating: 4.9,
      speed: "Fast",
      quality: "Excellent",
      isPremium: true,
      isPopular: true,
      icon: <Sparkles className="h-5 w-5" />,
      gradientClass: "from-purple-500 to-pink-500"
    },
    {
      id: "hailuo",
      name: "Hailuo AI",
      provider: "MiniMax",
      category: "budget",
      description: "Cost-effective AI video generation with great quality",
      features: ["Up to 6s videos", "1080p resolution", "Natural motion", "Fast processing"],
      pricing: { creditsPerSecond: 0.1, costPerCredit: 0.015 },
      maxDuration: 6,
      resolutions: ["720p", "1080p"],
      rating: 4.6,
      speed: "Very Fast",
      quality: "Good",
      isPremium: false,
      isPopular: false,
      icon: <Zap className="h-5 w-5" />,
      gradientClass: "from-green-500 to-blue-500"
    },
    {
      id: "runway",
      name: "Runway ML",
      provider: "Runway",
      category: "professional",
      description: "Professional-grade AI video generation for creators",
      features: ["Up to 18s videos", "8K resolution", "Professional effects", "Custom training"],
      pricing: { creditsPerSecond: 1.2, costPerCredit: 0.25 },
      maxDuration: 18,
      resolutions: ["1080p", "4K", "8K"],
      rating: 4.8,
      speed: "Medium",
      quality: "Excellent",
      isPremium: true,
      isPopular: false,
      icon: <Crown className="h-5 w-5" />,
      gradientClass: "from-orange-500 to-red-500"
    },
    {
      id: "pika",
      name: "Pika Labs",
      provider: "Pika",
      category: "creative",
      description: "Creative AI video generation with unique artistic styles",
      features: ["Up to 3s videos", "Artistic styles", "Creative effects", "Style transfer"],
      pricing: { creditsPerSecond: 0.3, costPerCredit: 0.08 },
      maxDuration: 3,
      resolutions: ["720p", "1080p"],
      rating: 4.4,
      speed: "Fast",
      quality: "Creative",
      isPremium: false,
      isPopular: false,
      icon: <Film className="h-5 w-5" />,
      gradientClass: "from-indigo-500 to-purple-500"
    },
    {
      id: "stable-video",
      name: "Stable Video",
      provider: "Stability AI",
      category: "open-source",
      description: "Open-source AI video generation with customizable models",
      features: ["Up to 4s videos", "Open source", "Customizable", "Community models"],
      pricing: { creditsPerSecond: 0.2, costPerCredit: 0.05 },
      maxDuration: 4,
      resolutions: ["512p", "1080p"],
      rating: 4.2,
      speed: "Medium",
      quality: "Good",
      isPremium: false,
      isPopular: false,
      icon: <Brain className="h-5 w-5" />,
      gradientClass: "from-blue-500 to-cyan-500"
    },
    {
      id: "luma",
      name: "Luma Dream",
      provider: "Luma AI",
      category: "premium",
      description: "Next-generation AI video with advanced 3D understanding",
      features: ["Up to 5s videos", "3D aware", "Object consistency", "Advanced lighting"],
      pricing: { creditsPerSecond: 0.8, costPerCredit: 0.18 },
      maxDuration: 5,
      resolutions: ["1080p", "4K"],
      rating: 4.7,
      speed: "Fast",
      quality: "Excellent",
      isPremium: true,
      isPopular: false,
      icon: <Rocket className="h-5 w-5" />,
      gradientClass: "from-yellow-500 to-orange-500"
    }
  ];

  const categories = [
    { id: "all", name: "All Models", icon: <Video className="h-4 w-4" /> },
    { id: "premium", name: "Premium", icon: <Crown className="h-4 w-4" /> },
    { id: "budget", name: "Budget", icon: <Zap className="h-4 w-4" /> },
    { id: "professional", name: "Professional", icon: <Shield className="h-4 w-4" /> },
    { id: "creative", name: "Creative", icon: <Sparkles className="h-4 w-4" /> },
    { id: "open-source", name: "Open Source", icon: <Brain className="h-4 w-4" /> }
  ];

  const filteredModels = selectedCategory === "all" 
    ? aiModels 
    : aiModels.filter(model => model.category === selectedCategory);

  const selectedModelData = aiModels.find(model => model.id === selectedModel);

  const canUseModel = (model: any) => {
    if (!model.isPremium) return true;
    return userSubscription !== "free";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your AI Model</h2>
        <p className="text-muted-foreground">
          Select the perfect AI model for your video generation needs
        </p>
      </div>

      {/* Category Tabs */}
      <Card className="glass">
        <CardContent className="p-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Selected Model Summary */}
      {selectedModelData && (
        <Card className="glass border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedModelData.gradientClass}`}>
                  <div className="text-white">{selectedModelData.icon}</div>
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedModelData.name}
                    {selectedModelData.isPopular && (
                      <Badge variant="default" className="bg-orange-500">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedModelData.provider}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${selectedModelData.pricing.costPerCredit}/video
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedModelData.pricing.creditsPerSecond} credits/sec
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Max: {selectedModelData.maxDuration}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedModelData.speed}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedModelData.rating}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedModelData.quality}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <Card 
            key={model.id}
            className={`glass cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id ? 'ring-2 ring-primary border-primary/20' : ''
            } ${!canUseModel(model) ? 'opacity-60' : ''}`}
            onClick={() => canUseModel(model) && onModelChange(model.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${model.gradientClass}`}>
                    <div className="text-white">{model.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {model.name}
                      {model.isPopular && (
                        <Badge variant="default" className="bg-orange-500 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                
                {selectedModel === model.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {model.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Features
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {model.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="text-sm font-semibold">{model.maxDuration}s</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Speed</div>
                  <div className="text-sm font-semibold">{model.speed}</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Rating</div>
                  <div className="text-sm font-semibold">{model.rating}/5</div>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-primary">
                      ${model.pricing.costPerCredit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      per video
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {model.pricing.creditsPerSecond} credits/sec
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              {model.isPremium && (
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Crown className="h-3 w-3" />
                  Premium model - requires subscription
                </div>
              )}

              {/* Upgrade Notice */}
              {!canUseModel(model) && (
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Info className="h-4 w-4" />
                    <span className="text-xs">Upgrade to access this model</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Model Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Model</th>
                  <th className="text-left p-2">Max Duration</th>
                  <th className="text-left p-2">Resolution</th>
                  <th className="text-left p-2">Speed</th>
                  <th className="text-left p-2">Cost</th>
                  <th className="text-left p-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded bg-gradient-to-r ${model.gradientClass}`}>
                          <div className="text-white text-xs">{model.icon}</div>
                        </div>
                        <span className="font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{model.maxDuration}s</td>
                    <td className="p-2">{model.resolutions.join(', ')}</td>
                    <td className="p-2">{model.speed}</td>
                    <td className="p-2">${model.pricing.costPerCredit}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {model.rating}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}