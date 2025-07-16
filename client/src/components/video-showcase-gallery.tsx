import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Heart, 
  Eye, 
  Share2, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Clock,
  Star,
  TrendingUp,
  Crown,
  Sparkles,
  Video,
  ExternalLink,
  Download
} from "lucide-react";

interface ShowcaseVideo {
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
  createdAt: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isPremium: boolean;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
}

interface VideoShowcaseGalleryProps {
  onVideoSelect?: (video: ShowcaseVideo) => void;
  maxVideos?: number;
  showControls?: boolean;
}

export default function VideoShowcaseGallery({ 
  onVideoSelect, 
  maxVideos = 12,
  showControls = true 
}: VideoShowcaseGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("trending");

  const showcaseVideos: ShowcaseVideo[] = [
    {
      id: "1",
      title: "Cinematic Mountain Sunset",
      description: "Breathtaking aerial view of mountain peaks during golden hour with dramatic lighting",
      videoUrl: "/showcase/mountain-sunset.mp4",
      thumbnailUrl: "/showcase/mountain-sunset-thumb.jpg",
      prompt: "Create a cinematic aerial view of mountain peaks during golden hour sunset with dramatic lighting and clouds",
      aiModel: "Kling AI",
      category: "Nature",
      duration: 15,
      views: 125847,
      likes: 8394,
      createdAt: "2024-01-15",
      tags: ["nature", "cinematic", "mountains", "sunset"],
      isFeatured: true,
      isNew: false,
      isPremium: true,
      creator: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        verified: true
      }
    },
    {
      id: "2",
      title: "Futuristic City Flythrough",
      description: "High-tech cityscape with flying cars and holographic displays",
      videoUrl: "/showcase/futuristic-city.mp4",
      thumbnailUrl: "/showcase/futuristic-city-thumb.jpg",
      prompt: "Create a futuristic city flythrough with flying cars, holographic displays, and neon lights",
      aiModel: "Runway ML",
      category: "Sci-Fi",
      duration: 20,
      views: 89234,
      likes: 5647,
      createdAt: "2024-01-12",
      tags: ["sci-fi", "futuristic", "city", "technology"],
      isFeatured: true,
      isNew: false,
      isPremium: true,
      creator: {
        name: "Alex Johnson",
        avatar: "/avatars/alex.jpg",
        verified: true
      }
    },
    {
      id: "3",
      title: "Underwater Ocean Life",
      description: "Vibrant coral reef ecosystem with tropical fish and marine life",
      videoUrl: "/showcase/underwater-ocean.mp4",
      thumbnailUrl: "/showcase/underwater-ocean-thumb.jpg",
      prompt: "Create an underwater scene with vibrant coral reef, tropical fish, and marine life swimming naturally",
      aiModel: "Luma Dream",
      category: "Nature",
      duration: 18,
      views: 67891,
      likes: 4523,
      createdAt: "2024-01-10",
      tags: ["underwater", "ocean", "marine", "colorful"],
      isFeatured: false,
      isNew: true,
      isPremium: false,
      creator: {
        name: "Maria Rodriguez",
        avatar: "/avatars/maria.jpg",
        verified: false
      }
    },
    {
      id: "4",
      title: "Fashion Model Runway",
      description: "Elegant fashion show with model walking on illuminated runway",
      videoUrl: "/showcase/fashion-runway.mp4",
      thumbnailUrl: "/showcase/fashion-runway-thumb.jpg",
      prompt: "Create an elegant fashion runway show with model walking confidently in designer outfit with dramatic lighting",
      aiModel: "Kling AI",
      category: "Fashion",
      duration: 12,
      views: 45678,
      likes: 3421,
      createdAt: "2024-01-08",
      tags: ["fashion", "runway", "model", "elegant"],
      isFeatured: false,
      isNew: true,
      isPremium: true,
      creator: {
        name: "David Kim",
        avatar: "/avatars/david.jpg",
        verified: true
      }
    },
    {
      id: "5",
      title: "Space Station Orbit",
      description: "International space station orbiting Earth with stunning views",
      videoUrl: "/showcase/space-station.mp4",
      thumbnailUrl: "/showcase/space-station-thumb.jpg",
      prompt: "Create a space station orbiting Earth with stunning views of the planet and stars in the background",
      aiModel: "Hailuo AI",
      category: "Space",
      duration: 22,
      views: 98765,
      likes: 7890,
      createdAt: "2024-01-05",
      tags: ["space", "earth", "orbit", "station"],
      isFeatured: true,
      isNew: false,
      isPremium: false,
      creator: {
        name: "Lisa Wang",
        avatar: "/avatars/lisa.jpg",
        verified: true
      }
    },
    {
      id: "6",
      title: "Abstract Art Animation",
      description: "Colorful abstract shapes morphing and flowing in artistic patterns",
      videoUrl: "/showcase/abstract-art.mp4",
      thumbnailUrl: "/showcase/abstract-art-thumb.jpg",
      prompt: "Create an abstract art animation with colorful shapes morphing and flowing in artistic patterns",
      aiModel: "Pika Labs",
      category: "Art",
      duration: 14,
      views: 34567,
      likes: 2345,
      createdAt: "2024-01-03",
      tags: ["abstract", "art", "colorful", "animation"],
      isFeatured: false,
      isNew: false,
      isPremium: false,
      creator: {
        name: "Mike Thompson",
        avatar: "/avatars/mike.jpg",
        verified: false
      }
    }
  ];

  const categories = [
    { id: "all", name: "All", count: showcaseVideos.length },
    { id: "nature", name: "Nature", count: showcaseVideos.filter(v => v.category === "Nature").length },
    { id: "sci-fi", name: "Sci-Fi", count: showcaseVideos.filter(v => v.category === "Sci-Fi").length },
    { id: "fashion", name: "Fashion", count: showcaseVideos.filter(v => v.category === "Fashion").length },
    { id: "space", name: "Space", count: showcaseVideos.filter(v => v.category === "Space").length },
    { id: "art", name: "Art", count: showcaseVideos.filter(v => v.category === "Art").length }
  ];

  const filteredVideos = showcaseVideos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || video.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return b.views - a.views;
        case "popular":
          return b.likes - a.likes;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "duration":
          return a.duration - b.duration;
        default:
          return 0;
      }
    })
    .slice(0, maxVideos);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Video Showcase Gallery</h2>
          <p className="text-muted-foreground">
            Explore amazing videos created by our community
          </p>
        </div>
        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      {showControls && (
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="trending">Trending</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {filteredVideos.map((video) => (
          <Card 
            key={video.id}
            className={`glass cursor-pointer transition-all hover:shadow-lg group ${
              viewMode === "list" ? "flex flex-row" : ""
            }`}
            onClick={() => onVideoSelect?.(video)}
          >
            <div className={`relative overflow-hidden ${
              viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-video"
            }`}>
              {/* Thumbnail Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3"
                >
                  <Play className="h-4 w-4 fill-white" />
                </Button>
              </div>

              {/* Video Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {video.isFeatured && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {video.isNew && (
                  <Badge className="bg-green-500 text-white text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {video.isPremium && (
                  <Badge className="bg-amber-500 text-white text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}s
                </Badge>
              </div>
            </div>

            <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {video.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs ml-2">
                    {video.category}
                  </Badge>
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                    <span className="text-white text-xs">
                      {video.creator.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {video.creator.name}
                      </span>
                      {video.creator.verified && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(video.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span>{formatViews(video.likes)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-blue-400" />
                    <span className="text-muted-foreground">{video.aiModel}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {video.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{video.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Heart className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredVideos.length === maxVideos && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Videos
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more videos
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
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