import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Clock,
  Eye,
  Heart,
  Play,
  Crown,
  Zap,
  RefreshCw,
  Target,
  Brain,
  Lightbulb,
  Wand2
} from "lucide-react";

interface RecommendationItem {
  id: string;
  type: "template" | "style" | "prompt" | "technique";
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  popularity: number;
  duration?: number;
  tags: string[];
  aiModel: string;
  isPremium: boolean;
  isNew: boolean;
  isTrending: boolean;
  matchScore: number; // AI-calculated relevance score
  recommendationReason: string;
}

interface ContentRecommendationCarouselProps {
  userInterests?: string[];
  currentContext?: string;
  onItemSelect: (item: RecommendationItem) => void;
  maxItems?: number;
}

export default function ContentRecommendationCarousel({
  userInterests = [],
  currentContext = "general",
  onItemSelect,
  maxItems = 12
}: ContentRecommendationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI-powered recommendations
  const generateRecommendations = (): RecommendationItem[] => {
    const allRecommendations: RecommendationItem[] = [
      {
        id: "1",
        type: "template",
        title: "Cinematic Product Reveal",
        description: "Professional product showcase with dramatic lighting and smooth camera movements",
        thumbnailUrl: "/recommendations/product-reveal.jpg",
        category: "Marketing",
        difficulty: "intermediate",
        popularity: 4.8,
        duration: 15,
        tags: ["product", "commercial", "dramatic", "professional"],
        aiModel: "Kling AI",
        isPremium: true,
        isNew: false,
        isTrending: true,
        matchScore: 0.95,
        recommendationReason: "Perfect for product launches and marketing campaigns"
      },
      {
        id: "2",
        type: "style",
        title: "Retro 80s Aesthetic",
        description: "Vibrant neon colors, synthwave vibes, and nostalgic visual effects",
        thumbnailUrl: "/recommendations/retro-80s.jpg",
        category: "Style",
        difficulty: "beginner",
        popularity: 4.6,
        tags: ["retro", "neon", "synthwave", "nostalgic"],
        aiModel: "Pika Labs",
        isPremium: false,
        isNew: true,
        isTrending: false,
        matchScore: 0.88,
        recommendationReason: "Trending visual style for creative content"
      },
      {
        id: "3",
        type: "prompt",
        title: "Nature Documentary Style",
        description: "BBC-style wildlife footage with natural lighting and smooth tracking",
        thumbnailUrl: "/recommendations/nature-doc.jpg",
        category: "Documentary",
        difficulty: "advanced",
        popularity: 4.9,
        duration: 25,
        tags: ["nature", "wildlife", "documentary", "professional"],
        aiModel: "Runway ML",
        isPremium: true,
        isNew: false,
        isTrending: true,
        matchScore: 0.92,
        recommendationReason: "High-quality nature content generation"
      },
      {
        id: "4",
        type: "technique",
        title: "Parallax Scrolling Effect",
        description: "Create depth with layered background movement and foreground focus",
        thumbnailUrl: "/recommendations/parallax.jpg",
        category: "Technique",
        difficulty: "intermediate",
        popularity: 4.4,
        tags: ["parallax", "depth", "layered", "modern"],
        aiModel: "Luma Dream",
        isPremium: false,
        isNew: true,
        isTrending: false,
        matchScore: 0.81,
        recommendationReason: "Modern technique for engaging videos"
      },
      {
        id: "5",
        type: "template",
        title: "Social Media Story",
        description: "Vertical format optimized for Instagram and TikTok with trending elements",
        thumbnailUrl: "/recommendations/social-story.jpg",
        category: "Social",
        difficulty: "beginner",
        popularity: 4.7,
        duration: 10,
        tags: ["social", "vertical", "instagram", "tiktok"],
        aiModel: "Hailuo AI",
        isPremium: false,
        isNew: false,
        isTrending: true,
        matchScore: 0.89,
        recommendationReason: "Optimized for social media engagement"
      },
      {
        id: "6",
        type: "style",
        title: "Minimalist Clean Design",
        description: "Simple, clean aesthetics with white space and subtle animations",
        thumbnailUrl: "/recommendations/minimalist.jpg",
        category: "Style",
        difficulty: "beginner",
        popularity: 4.5,
        tags: ["minimal", "clean", "simple", "modern"],
        aiModel: "Stable Video",
        isPremium: false,
        isNew: false,
        isTrending: false,
        matchScore: 0.76,
        recommendationReason: "Timeless design approach"
      },
      {
        id: "7",
        type: "prompt",
        title: "Futuristic Technology",
        description: "Sci-fi inspired visuals with holographic elements and advanced interfaces",
        thumbnailUrl: "/recommendations/futuristic-tech.jpg",
        category: "Technology",
        difficulty: "advanced",
        popularity: 4.8,
        duration: 18,
        tags: ["futuristic", "technology", "holographic", "sci-fi"],
        aiModel: "Runway ML",
        isPremium: true,
        isNew: true,
        isTrending: true,
        matchScore: 0.91,
        recommendationReason: "Cutting-edge visual concepts"
      },
      {
        id: "8",
        type: "technique",
        title: "Time-lapse Transitions",
        description: "Seamless time-lapse effects with smooth transitions between scenes",
        thumbnailUrl: "/recommendations/timelapse.jpg",
        category: "Technique",
        difficulty: "intermediate",
        popularity: 4.6,
        tags: ["timelapse", "transitions", "smooth", "dynamic"],
        aiModel: "Kling AI",
        isPremium: true,
        isNew: false,
        isTrending: false,
        matchScore: 0.84,
        recommendationReason: "Professional storytelling technique"
      }
    ];

    // Sort by match score and return top recommendations
    return allRecommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxItems);
  };

  const refreshRecommendations = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRecommendations(generateRecommendations());
    setIsLoading(false);
  };

  useEffect(() => {
    setRecommendations(generateRecommendations());
  }, [userInterests, currentContext]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(recommendations.length / 4));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, recommendations.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(recommendations.length / 4));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(recommendations.length / 4)) % Math.ceil(recommendations.length / 4));
  };

  const getVisibleItems = () => {
    const itemsPerSlide = 4;
    const startIndex = currentIndex * itemsPerSlide;
    return recommendations.slice(startIndex, startIndex + itemsPerSlide);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "template":
        return <Wand2 className="h-4 w-4" />;
      case "style":
        return <Sparkles className="h-4 w-4" />;
      case "prompt":
        return <Lightbulb className="h-4 w-4" />;
      case "technique":
        return <Target className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Recommendations</h2>
            <p className="text-sm text-muted-foreground">
              Personalized content suggestions based on your interests
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendations.slice(slideIndex * 4, (slideIndex + 1) * 4).map((item) => (
                        <Card 
                          key={item.id}
                          className="glass cursor-pointer transition-all hover:shadow-lg group"
                          onClick={() => onItemSelect(item)}
                        >
                          <CardHeader className="p-0">
                            <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
                              {/* Thumbnail placeholder */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white opacity-70" />
                              </div>
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                              
                              {/* Badges */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <Badge className={`text-white text-xs ${getDifficultyColor(item.difficulty)}`}>
                                  {item.difficulty}
                                </Badge>
                                {item.isNew && (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    New
                                  </Badge>
                                )}
                                {item.isTrending && (
                                  <Badge className="bg-orange-500 text-white text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Type and Premium badges */}
                              <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                                  {getTypeIcon(item.type)}
                                  <span className="ml-1 capitalize">{item.type}</span>
                                </Badge>
                                {item.isPremium && (
                                  <Badge className="bg-amber-500 text-white text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Duration */}
                              {item.duration && (
                                <div className="absolute bottom-2 right-2">
                                  <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {item.duration}s
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-sm line-clamp-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            </div>
                            
                            {/* AI Recommendation Reason */}
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <Brain className="h-3 w-3 text-blue-500" />
                                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  AI Insight
                                </span>
                              </div>
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                {item.recommendationReason}
                              </p>
                            </div>
                            
                            {/* Match Score */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs">{item.popularity}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3 text-green-500" />
                                  <span className="text-xs">{Math.round(item.matchScore * 100)}% match</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-blue-500" />
                                <span className="text-xs">{item.aiModel}</span>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={recommendations.length <= 4}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={recommendations.length <= 4}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Context Info */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart Recommendations</h3>
                <p className="text-xs text-muted-foreground">
                  Based on your activity: {currentContext} • {userInterests.length} interests tracked
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {recommendations.length} items
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}