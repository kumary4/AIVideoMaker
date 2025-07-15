import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import PremiumHeader from "@/components/premium-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  Clock, 
  TrendingUp, 
  Download, 
  Eye, 
  RefreshCw, 
  Play,
  Sparkles,
  Crown,
  Zap,
  MoreVertical,
  Calendar,
  BarChart3,
  Users,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PremiumDashboard() {
  const [, navigate] = useLocation();
  const [generatingTimer, setGeneratingTimer] = useState<{ [key: number]: number }>({});

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['/api/videos'],
    enabled: !!user,
    refetchInterval: 5000,
  });

  // Timer effect for generating videos
  useEffect(() => {
    const interval = setInterval(() => {
      setGeneratingTimer(prev => {
        const newTimer = { ...prev };
        Object.keys(newTimer).forEach(key => {
          newTimer[parseInt(key)] = newTimer[parseInt(key)] + 1;
        });
        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track generating videos
  useEffect(() => {
    if (videos) {
      const generating = videos.filter((video: any) => video.status === 'generating');
      const newTimer = { ...generatingTimer };
      
      generating.forEach((video: any) => {
        if (!(video.id in newTimer)) {
          newTimer[video.id] = 0;
        }
      });
      
      // Remove completed videos from timer
      Object.keys(newTimer).forEach(key => {
        const video = videos.find((v: any) => v.id === parseInt(key));
        if (!video || video.status !== 'generating') {
          delete newTimer[parseInt(key)];
        }
      });
      
      setGeneratingTimer(newTimer);
    }
  }, [videos]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (video: any) => {
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `video-${video.id}.mp4`;
    link.click();
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const stats = [
    {
      title: "Total Videos",
      value: videos?.length || 0,
      icon: <Video className="h-5 w-5" />,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Credits Used",
      value: `${(user.credits || 0)}`,
      icon: <Zap className="h-5 w-5" />,
      change: "Available",
      changeType: "neutral"
    },
    {
      title: "This Month",
      value: videos?.filter((v: any) => new Date(v.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0,
      icon: <Calendar className="h-5 w-5" />,
      change: "+25%",
      changeType: "positive"
    },
    {
      title: "Avg. Rating",
      value: "4.9",
      icon: <Star className="h-5 w-5" />,
      change: "+0.2",
      changeType: "positive"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{user.username || 'Creator'}</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your AI video projects and track your creative progress
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="btn-premium">
            <Sparkles className="h-4 w-4 mr-2" />
            Create New Video
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-400' : 
                      stat.changeType === 'negative' ? 'text-red-400' : 
                      'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center">
                    <div className="text-white">{stat.icon}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Grid */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Your Videos
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetch()}
                className="hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
              </div>
            ) : !videos || videos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start creating amazing videos with AI
                </p>
                <Button onClick={() => navigate('/')} className="btn-premium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Your First Video
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video: any) => (
                  <Card key={video.id} className="card-premium group">
                    <CardContent className="p-0">
                      <div className="relative">
                        {video.videoUrl ? (
                          <video 
                            src={video.videoUrl} 
                            className="w-full h-48 object-cover rounded-t-xl"
                            poster={video.thumbnailUrl}
                            controls={false}
                            muted
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-t-xl flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-pulse-slow">
                                <Video className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  {video.status === 'generating' ? 'Generating...' : 'Processing...'}
                                </p>
                                {video.status === 'generating' && generatingTimer[video.id] && (
                                  <p className="text-xs text-purple-400 mt-1">
                                    {formatTimer(generatingTimer[video.id])}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 glass opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass border-white/10">
                              {video.videoUrl && (
                                <DropdownMenuItem onClick={() => handleDownload(video)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="absolute top-3 left-3">
                          <Badge 
                            variant={video.status === 'completed' ? 'default' : 'secondary'}
                            className={
                              video.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : video.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }
                          >
                            {video.status === 'completed' ? 'Ready' : 
                             video.status === 'failed' ? 'Failed' : 'Processing'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 truncate">
                          {video.prompt?.substring(0, 50) || 'Untitled Video'}
                          {video.prompt?.length > 50 && '...'}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(video.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {video.duration || '30'}s
                            </Badge>
                          </div>
                        </div>
                        
                        {video.videoUrl && (
                          <div className="mt-4 flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 hover:bg-white/10"
                              onClick={() => window.open(video.videoUrl, '_blank')}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                            <Button 
                              size="sm" 
                              className="btn-premium flex-1"
                              onClick={() => handleDownload(video)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}