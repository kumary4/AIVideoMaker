import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PremiumHeader from "@/components/premium-header";
import VideoGenerator from "@/components/video-generator";
import VideoPlayer from "@/components/video-player";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Images, 
  Mic, 
  Edit, 
  Download, 
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  Video,
  Clock,
  TrendingUp,
  Star,
  Sparkles,
  Zap,
  Play,
  Wand2,
  Rocket,
  Crown,
  ArrowRight,
  Globe,
  Shield,
  Infinity
} from "lucide-react";

export default function PremiumHome() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  // Poll for video completion
  useEffect(() => {
    if (generatedVideo && !generatedVideo.videoUrl && generatedVideo.status !== 'failed') {
      const pollInterval = setInterval(async () => {
        try {
          const response = await apiRequest("GET", `/api/videos/${generatedVideo.id}`);
          const updatedVideo = await response.json();
          
          if (updatedVideo.videoUrl || updatedVideo.status === 'failed') {
            setGeneratedVideo(updatedVideo);
            clearInterval(pollInterval);
            
            if (updatedVideo.videoUrl) {
              toast({
                title: "Video Ready!",
                description: "Your video has been generated successfully.",
              });
            }
          }
        } catch (error) {
          console.error('Error polling video status:', error);
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [generatedVideo, toast]);

  const generateVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate-video", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedVideo(data);
      setActiveTab("preview");
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: videos } = useQuery({
    queryKey: ['/api/videos'],
    enabled: !!user,
  });

  const handleVideoGeneration = (data: any) => {
    if (!user) {
      navigate('/pricing');
      return;
    }
    
    if (user.credits < 1) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to generate a video.",
        variant: "destructive",
      });
      navigate('/pricing');
      return;
    }

    generateVideoMutation.mutate(data);
  };

  const faqData = [
    {
      question: "How does AI video generation work?",
      answer: "Our AI uses advanced machine learning models to transform text prompts into high-quality videos. Simply describe what you want, and our AI will create a professional video in minutes."
    },
    {
      question: "What video formats are supported?",
      answer: "We support MP4, WebM, and MOV formats. All videos are generated in high definition (1080p) and optimized for web and social media platforms."
    },
    {
      question: "How long does video generation take?",
      answer: "Most videos are generated within 2-5 minutes, depending on complexity and duration. You'll receive real-time updates on the progress."
    },
    {
      question: "Can I customize the video style?",
      answer: "Yes! You can choose from various styles including cinematic, documentary, animation, commercial, and more. Each style affects the visual tone and mood of your video."
    },
    {
      question: "What's the credit system?",
      answer: "Credits are used to generate videos. Each video costs 1 credit regardless of duration (up to 3 minutes). You can purchase credits or subscribe to our monthly plan."
    }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Advanced AI creates stunning videos from text prompts in minutes"
    },
    {
      icon: <Images className="h-8 w-8" />,
      title: "Multiple Styles",
      description: "Choose from cinematic, documentary, animation, and commercial styles"
    },
    {
      icon: <Wand2 className="h-8 w-8" />,
      title: "Custom Effects",
      description: "Apply professional visual effects and transitions automatically"
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "High Quality Export",
      description: "Export in HD quality with various formats for any platform"
    }
  ];

  const stats = [
    { number: "50K+", label: "Videos Generated", icon: <Video className="h-5 w-5" /> },
    { number: "10K+", label: "Happy Users", icon: <Users className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="h-5 w-5" /> }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <PremiumHeader />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-32">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium">Powered by Kling AI</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="text-gradient">Create</span> Pro-Level<br />
                Videos with <span className="text-gradient">AI</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Transform your ideas into stunning professional videos in minutes. 
                No editing skills required - just describe what you want and let AI do the magic.
              </p>
              
              <div className="flex items-center justify-center space-x-6">
                <Button 
                  onClick={() => navigate('/pricing')} 
                  className="btn-premium text-lg px-8 py-4 h-14"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-lg px-8 py-4 h-14 hover:bg-white/10"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="text-purple-400 mr-2">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-6">
                Everything You Need to Create <span className="text-gradient">Amazing Videos</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful AI tools that make professional video creation accessible to everyone
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card-premium p-8 text-center">
                  <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about VideoGen AI
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="card-premium">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-purple-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="card-premium p-12">
              <Crown className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6">
                Ready to Create Your First <span className="text-gradient">AI Video</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators who are already using VideoGen AI to produce amazing content
              </p>
              <Button 
                onClick={() => navigate('/pricing')} 
                className="btn-premium text-lg px-8 py-4 h-14"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Video Generation */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="generate" className="data-[state=active]:bg-purple-500/20">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-purple-500/20">
                  <Play className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generate" className="mt-6">
                <div className="card-premium p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">AI Video Studio</h2>
                      <p className="text-muted-foreground">Describe your video and watch AI bring it to life</p>
                    </div>
                  </div>
                  
                  <VideoGenerator 
                    onGenerate={handleVideoGeneration}
                    isLoading={generateVideoMutation.isPending}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="mt-6">
                <div className="card-premium p-8">
                  {generatedVideo ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Your Video</h2>
                          <p className="text-muted-foreground">
                            Status: {generatedVideo.status === 'completed' ? 'Ready' : 'Processing...'}
                          </p>
                        </div>
                      </div>
                      
                      {generatedVideo.videoUrl ? (
                        <VideoPlayer
                          videoUrl={generatedVideo.videoUrl}
                          title={generatedVideo.prompt}
                          aspectRatio="16:9"
                          onDownload={() => {
                            const link = document.createElement('a');
                            link.href = generatedVideo.videoUrl;
                            link.download = `video-${generatedVideo.id}.mp4`;
                            link.click();
                          }}
                        />
                      ) : (
                        <div className="glass rounded-2xl p-12 text-center">
                          <div className="animate-pulse-slow">
                            <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Generating Your Video...</h3>
                            <p className="text-muted-foreground">This usually takes 2-5 minutes</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="glass rounded-2xl p-12 text-center">
                      <Play className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Video Generated Yet</h3>
                      <p className="text-muted-foreground">Generate your first video using the AI Studio</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - User Info & Recent Videos */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="card-premium p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="gradient-primary w-10 h-10 rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Your Account</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.subscription === 'test-monthly' ? 'Pro Member' : 'Basic Member'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credits</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    {user.credits}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Videos Created</span>
                  <Badge variant="secondary">
                    {videos?.length || 0}
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <Button 
                onClick={() => navigate('/pricing')} 
                className="w-full btn-premium"
                size="sm"
              >
                <Zap className="h-4 w-4 mr-2" />
                Get More Credits
              </Button>
            </div>

            {/* Recent Videos */}
            <div className="card-premium p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Recent Videos
              </h3>
              
              {videos && videos.length > 0 ? (
                <div className="space-y-3">
                  {videos.slice(0, 3).map((video: any) => (
                    <div key={video.id} className="glass rounded-xl p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {video.prompt?.substring(0, 30) || 'Untitled Video'}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {video.status === 'completed' ? 'Ready' : 'Processing'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="ghost" 
                    className="w-full text-sm hover:bg-white/10"
                  >
                    View All Videos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No videos yet</p>
                  <p className="text-xs text-muted-foreground">Generate your first video to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}