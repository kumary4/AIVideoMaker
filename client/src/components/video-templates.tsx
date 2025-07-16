import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Star, 
  Crown, 
  Play, 
  Clock, 
  TrendingUp, 
  Heart,
  Share,
  Copy,
  Sparkles,
  Video,
  Megaphone,
  BookOpen,
  Gamepad2,
  Briefcase,
  Music,
  Palette,
  Zap
} from "lucide-react";

interface VideoTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  previewUrl?: string;
  prompt: string;
  duration: number;
  style: string;
  aspectRatio: string;
  aiModel: string;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  tags: string[];
}

interface VideoTemplatesProps {
  onSelectTemplate: (template: VideoTemplate) => void;
  userSubscription?: string;
}

export default function VideoTemplates({ onSelectTemplate, userSubscription = "free" }: VideoTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const templates: VideoTemplate[] = [
    {
      id: 1,
      name: "Corporate Presentation",
      description: "Professional corporate video with smooth transitions and clean aesthetics",
      category: "business",
      thumbnailUrl: "/templates/corporate-thumb.jpg",
      previewUrl: "/templates/corporate-preview.mp4",
      prompt: "Create a professional corporate presentation video with smooth transitions, clean white background, modern graphics, and executive speaking confidently",
      duration: 30,
      style: "corporate",
      aspectRatio: "16:9",
      aiModel: "kling",
      isPremium: true,
      usageCount: 12847,
      rating: 4.8,
      tags: ["professional", "business", "corporate", "presentation"]
    },
    {
      id: 2,
      name: "Product Showcase",
      description: "Dynamic product demonstration with 360° views and highlighting features",
      category: "marketing",
      thumbnailUrl: "/templates/product-thumb.jpg",
      previewUrl: "/templates/product-preview.mp4", 
      prompt: "Create a dynamic product showcase video with 360-degree rotation, feature highlights, sleek background, and professional lighting",
      duration: 15,
      style: "commercial",
      aspectRatio: "16:9",
      aiModel: "kling",
      isPremium: false,
      usageCount: 8932,
      rating: 4.6,
      tags: ["product", "showcase", "marketing", "commercial"]
    },
    {
      id: 3,
      name: "Social Media Story",
      description: "Engaging vertical video perfect for Instagram and TikTok",
      category: "social",
      thumbnailUrl: "/templates/social-thumb.jpg",
      previewUrl: "/templates/social-preview.mp4",
      prompt: "Create an engaging vertical social media video with vibrant colors, dynamic text animations, trending music, and youthful energy",
      duration: 15,
      style: "trendy",
      aspectRatio: "9:16",
      aiModel: "hailuo",
      isPremium: false,
      usageCount: 15623,
      rating: 4.7,
      tags: ["social", "instagram", "tiktok", "vertical", "trendy"]
    },
    {
      id: 4,
      name: "Educational Tutorial",
      description: "Clear step-by-step educational content with annotations",
      category: "education",
      thumbnailUrl: "/templates/education-thumb.jpg",
      previewUrl: "/templates/education-preview.mp4",
      prompt: "Create an educational tutorial video with clear step-by-step instructions, helpful annotations, professional instructor, and clean learning environment",
      duration: 45,
      style: "educational",
      aspectRatio: "16:9",
      aiModel: "kling",
      isPremium: true,
      usageCount: 6754,
      rating: 4.9,
      tags: ["education", "tutorial", "learning", "instructor"]
    },
    {
      id: 5,
      name: "Gaming Highlight",
      description: "Epic gaming moments with dynamic effects and transitions",
      category: "gaming",
      thumbnailUrl: "/templates/gaming-thumb.jpg",
      previewUrl: "/templates/gaming-preview.mp4",
      prompt: "Create an epic gaming highlight video with dynamic effects, screen transitions, gaming UI elements, and intense action sequences",
      duration: 20,
      style: "gaming",
      aspectRatio: "16:9",
      aiModel: "runway",
      isPremium: true,
      usageCount: 9876,
      rating: 4.5,
      tags: ["gaming", "highlight", "action", "dynamic"]
    },
    {
      id: 6,
      name: "Music Video",
      description: "Artistic music video with rhythm-synced visuals",
      category: "entertainment",
      thumbnailUrl: "/templates/music-thumb.jpg",
      previewUrl: "/templates/music-preview.mp4",
      prompt: "Create an artistic music video with rhythm-synced visuals, colorful lighting effects, dance sequences, and creative cinematography",
      duration: 60,
      style: "artistic",
      aspectRatio: "16:9",
      aiModel: "pika",
      isPremium: true,
      usageCount: 4532,
      rating: 4.4,
      tags: ["music", "artistic", "rhythm", "creative"]
    },
    {
      id: 7,
      name: "Food & Recipe",
      description: "Appetizing food video with cooking process and ingredients",
      category: "lifestyle",
      thumbnailUrl: "/templates/food-thumb.jpg",
      previewUrl: "/templates/food-preview.mp4",
      prompt: "Create an appetizing food video showing cooking process, fresh ingredients, steam effects, and final delicious presentation",
      duration: 25,
      style: "lifestyle",
      aspectRatio: "1:1",
      aiModel: "hailuo",
      isPremium: false,
      usageCount: 7891,
      rating: 4.6,
      tags: ["food", "cooking", "recipe", "lifestyle"]
    },
    {
      id: 8,
      name: "Travel Adventure",
      description: "Stunning travel footage with scenic landscapes and activities",
      category: "travel",
      thumbnailUrl: "/templates/travel-thumb.jpg",
      previewUrl: "/templates/travel-preview.mp4",
      prompt: "Create a stunning travel adventure video with scenic landscapes, outdoor activities, cultural experiences, and breathtaking views",
      duration: 40,
      style: "cinematic",
      aspectRatio: "16:9",
      aiModel: "kling",
      isPremium: true,
      usageCount: 11234,
      rating: 4.8,
      tags: ["travel", "adventure", "scenic", "cinematic"]
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", icon: <Video className="h-4 w-4" /> },
    { id: "business", name: "Business", icon: <Briefcase className="h-4 w-4" /> },
    { id: "marketing", name: "Marketing", icon: <Megaphone className="h-4 w-4" /> },
    { id: "social", name: "Social Media", icon: <Share className="h-4 w-4" /> },
    { id: "education", name: "Education", icon: <BookOpen className="h-4 w-4" /> },
    { id: "gaming", name: "Gaming", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "entertainment", name: "Entertainment", icon: <Music className="h-4 w-4" /> },
    { id: "lifestyle", name: "Lifestyle", icon: <Palette className="h-4 w-4" /> },
    { id: "travel", name: "Travel", icon: <Zap className="h-4 w-4" /> }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesAspectRatio = selectedAspectRatio === "all" || template.aspectRatio === selectedAspectRatio;
    const matchesDuration = selectedDuration === "all" || 
                           (selectedDuration === "short" && template.duration <= 20) ||
                           (selectedDuration === "medium" && template.duration > 20 && template.duration <= 40) ||
                           (selectedDuration === "long" && template.duration > 40);
    
    return matchesSearch && matchesCategory && matchesAspectRatio && matchesDuration;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.usageCount - a.usageCount;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      case "duration":
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  const canUseTemplate = (template: VideoTemplate) => {
    if (!template.isPremium) return true;
    return userSubscription !== "free";
  };

  const handleUseTemplate = (template: VideoTemplate) => {
    if (!canUseTemplate(template)) return;
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Video Templates</h2>
        <p className="text-muted-foreground">
          Start with professional templates and customize them with AI
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Aspect Ratio Filter */}
            <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
              <SelectTrigger>
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratios</SelectItem>
                <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
              </SelectContent>
            </Select>

            {/* Duration Filter */}
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="short">Short (≤20s)</SelectItem>
                <SelectItem value="medium">Medium (21-40s)</SelectItem>
                <SelectItem value="long">Long (>40s)</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {sortedTemplates.length} templates found
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Sorted by {sortBy}
          </span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`glass cursor-pointer transition-all hover:shadow-lg group ${
              !canUseTemplate(template) ? 'opacity-60' : ''
            }`}
            onClick={() => handleUseTemplate(template)}
          >
            <CardHeader className="p-0">
              <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
                {/* Thumbnail placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-70" />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                
                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
                
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-black/60 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    {template.duration}s
                  </Badge>
                </div>
                
                {/* Aspect ratio badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/60 text-white">
                    {template.aspectRatio}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{template.usageCount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">{template.aiModel}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full"
                variant={canUseTemplate(template) ? "default" : "outline"}
                disabled={!canUseTemplate(template)}
              >
                {canUseTemplate(template) ? (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Premium Required
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more templates
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedAspectRatio("all");
                setSelectedDuration("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}