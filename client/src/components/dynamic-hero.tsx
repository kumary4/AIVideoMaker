import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Zap,
  Crown,
  Video,
  Clock,
  Eye,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface FeaturedVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  prompt: string;
  aiModel: string;
  category: string;
  duration: number;
  views: number;
  likes: number;
  isNew: boolean;
  isTrending: boolean;
  isPremium: boolean;
}

interface DynamicHeroProps {
  onStartCreating: () => void;
}

export default function DynamicHero({ onStartCreating }: DynamicHeroProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const featuredVideos: FeaturedVideo[] = [
    {
      id: "1",
      title: "Cinematic Product Launch",
      description: "Professional product reveal with dramatic lighting and smooth camera movements",
      videoUrl: "/showcase/product-launch.mp4",
      thumbnailUrl: "/showcase/product-launch-thumb.jpg",
      prompt: "Create a cinematic product launch video with dramatic lighting, smooth camera movements, and professional presentation",
      aiModel: "Kling AI",
      category: "Marketing",
      duration: 15,
      views: 45782,
      likes: 2341,
      isNew: true,
      isTrending: true,
      isPremium: true
    },
    {
      id: "2",
      title: "Nature Documentary",
      description: "Breathtaking wildlife footage with natural movements and stunning landscapes",
      videoUrl: "/showcase/nature-doc.mp4",
      thumbnailUrl: "/showcase/nature-doc-thumb.jpg",
      prompt: "Create a nature documentary style video with wildlife, natural movements, and stunning landscapes",
      aiModel: "Kling AI",
      category: "Documentary",
      duration: 20,
      views: 87234,
      likes: 4567,
      isNew: false,
      isTrending: true,
      isPremium: false
    },
    {
      id: "3",
      title: "Fashion Commercial",
      description: "High-fashion commercial with model poses and dynamic wardrobe changes",
      videoUrl: "/showcase/fashion-commercial.mp4",
      thumbnailUrl: "/showcase/fashion-commercial-thumb.jpg",
      prompt: "Create a high-fashion commercial video with model poses, dynamic wardrobe changes, and studio lighting",
      aiModel: "Runway ML",
      category: "Fashion",
      duration: 25,
      views: 32156,
      likes: 1892,
      isNew: false,
      isTrending: false,
      isPremium: true
    },
    {
      id: "4",
      title: "Tech Innovation",
      description: "Futuristic technology demonstration with holographic elements and sleek design",
      videoUrl: "/showcase/tech-innovation.mp4",
      thumbnailUrl: "/showcase/tech-innovation-thumb.jpg",
      prompt: "Create a futuristic tech innovation video with holographic elements, sleek design, and advanced technology",
      aiModel: "Luma Dream",
      category: "Technology",
      duration: 18,
      views: 23891,
      likes: 1456,
      isNew: true,
      isTrending: false,
      isPremium: true
    }
  ];

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % featuredVideos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, featuredVideos.length]);

  const currentVideo = featuredVideos[currentVideoIndex];

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % featuredVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
  };

  const goToVideo = (index: number) => {
    setCurrentVideoIndex(index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="text-white border-white/20">
                  <Star className="h-3 w-3 mr-1" />
                  Premium Quality
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Create Amazing Videos with{" "}
                <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Magic
                </span>
              </h1>

              <p className="text-xl text-white/80 max-w-2xl">
                Transform your ideas into stunning professional videos using the most advanced AI models. 
                No filming required – just describe your vision and watch it come to life.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartCreating}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                <Video className="h-5 w-5 mr-2" />
                Start Creating
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Examples
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1M+</div>
                <div className="text-sm text-white/60">Videos Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm text-white/60">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm text-white/60">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Video */}
          <div className="relative">
            <Card className="glass border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-blue-600">
                  {/* Video Preview Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
                      <Button
                        size="lg"
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-6"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        <Play className="h-8 w-8 fill-white" />
                      </Button>
                    </div>
                  </div>

                  {/* Video Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {currentVideo.isNew && (
                      <Badge className="bg-green-500 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                    {currentVideo.isTrending && (
                      <Badge className="bg-orange-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {currentVideo.isPremium && (
                      <Badge className="bg-amber-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/60 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentVideo.duration}s
                    </Badge>
                  </div>

                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={prevVideo}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                    onClick={nextVideo}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Video Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">
                        {currentVideo.title}
                      </h3>
                      <p className="text-sm text-white/70">
                        {currentVideo.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-white border-white/20">
                      {currentVideo.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-white/60" />
                        <span className="text-white/60">
                          {currentVideo.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-white/60">
                          {currentVideo.likes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-blue-400" />
                      <span className="text-white/60">{currentVideo.aiModel}</span>
                    </div>
                  </div>

                  {/* Prompt Preview */}
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-white">AI Prompt:</span>
                    </div>
                    <p className="text-sm text-white/70 italic">
                      "{currentVideo.prompt}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToVideo(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentVideoIndex
                      ? 'bg-purple-400 w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* AI Models Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            Powered by Leading AI Models
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Kling AI", "Runway ML", "Luma Dream", "Hailuo AI"].map((model, index) => (
              <Card key={index} className="glass border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{model}</h3>
                  <p className="text-sm text-white/60">Advanced AI</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}