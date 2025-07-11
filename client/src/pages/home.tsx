import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import VideoGenerator from "@/components/video-generator";
import VideoPlayer from "@/components/video-player";
import PricingCard from "@/components/pricing-card";
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
  Star
} from "lucide-react";

export default function Home() {
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
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(pollInterval);
    }
  }, [generatedVideo, toast]);

  const generateVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate-video", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      console.log("Video generation response:", data);
      setGeneratedVideo(data);
      setActiveTab("video");
      
      if (data.videoUrl) {
        toast({
          title: "Video Generated Successfully!",
          description: "Your video is ready. You can watch it below or download it.",
        });
      } else {
        toast({
          title: "Video Generation Started",
          description: "Your video is being generated. It will appear here when ready.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    },
    onError: (error: any) => {
      if (error.message.includes('Not authenticated')) {
        toast({
          title: "Please Sign Up First",
          description: "Create a free account to start generating videos with 5 free credits!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Scripts",
      description: "Generate engaging scripts tailored to your topic and audience, saving hours of creative work.",
      color: "text-purple-600",
    },
    {
      icon: Images,
      title: "AI-Generated Visuals",
      description: "Create stunning visuals and animations that perfectly match your video content and style.",
      color: "text-blue-600",
    },
    {
      icon: Mic,
      title: "Realistic AI Voices",
      description: "Choose from 50+ natural-sounding AI voices in multiple languages and accents.",
      color: "text-green-600",
    },
    {
      icon: Edit,
      title: "Smart Editing Tools",
      description: "Edit videos with simple text commands like \"add intro\" or \"change background music\".",
      color: "text-orange-600",
    },
    {
      icon: Download,
      title: "Multi-Platform Export",
      description: "Export in various formats and resolutions optimized for different social media platforms.",
      color: "text-purple-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share projects with team members and collaborate in real-time on video creation.",
      color: "text-blue-600",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "per month",
      features: [
        "5 video generations",
        "720p resolution",
        "30-second videos",
        "Watermark included"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Starter",
      price: "$19",
      period: "per month",
      features: [
        "50 video generations",
        "1080p resolution",
        "60-second videos",
        "No watermark",
        "Basic AI voices"
      ],
      buttonText: "Choose Starter",
      buttonVariant: "default" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "per month",
      features: [
        "200 video generations",
        "4K resolution",
        "2-minute videos",
        "Premium AI voices",
        "Custom branding",
        "Priority support"
      ],
      buttonText: "Choose Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      features: [
        "Unlimited generations",
        "Custom resolutions",
        "Long-form videos",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does KlingAI generate videos?",
      answer: "KlingAI uses advanced AI technology to analyze your text prompt and generate corresponding visuals, scripts, voiceovers, and music that match your specifications."
    },
    {
      question: "What video formats are supported?",
      answer: "We support MP4, MOV, and WebM formats with various resolutions from 720p to 4K, optimized for different platforms."
    },
    {
      question: "Can I customize the generated videos?",
      answer: "Yes! You can edit videos using our smart editing tools with simple text commands, customize voiceovers, and adjust visual elements."
    },
    {
      question: "How do credits work?",
      answer: "Credits are used to generate videos. Longer videos require more credits. You get credits with your subscription plan and can purchase additional credits as needed."
    },
    {
      question: "Is there a mobile app?",
      answer: "We're currently working on mobile apps for iOS and Android. For now, our web platform is fully responsive and works great on mobile devices."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Generate AI Videos from{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Simple Text Prompts
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Powered by Kling AI, create professional videos with scripts, visuals, voiceovers, and music. 
              Turn your ideas into publish-ready content in minutes.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="generate">Generate Video</TabsTrigger>
                  <TabsTrigger value="video">Generated Video</TabsTrigger>
                </TabsList>
                
                <TabsContent value="generate" className="space-y-4">
                  <VideoGenerator onGenerate={generateVideoMutation.mutate} isLoading={generateVideoMutation.isPending} />
                </TabsContent>
                
                <TabsContent value="video" className="space-y-4">
                  {generatedVideo ? (
                    <div className="bg-white rounded-lg shadow-xl p-6">
                      {generatedVideo.videoUrl ? (
                        <VideoPlayer 
                          videoUrl={generatedVideo.videoUrl} 
                          title={generatedVideo.title || "Generated Video"}
                          onDownload={() => {
                            if (generatedVideo.videoUrl) {
                              window.open(generatedVideo.videoUrl, '_blank');
                            }
                          }}
                        />
                      ) : generatedVideo.status === 'failed' ? (
                        <div className="text-center py-16">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <Video className="w-8 h-8 text-red-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Generation Failed</h3>
                          <p className="text-gray-600 mb-4">
                            {generatedVideo.title || "Your video"} failed to generate.
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            The AI video service is temporarily unavailable. Please try again later.
                          </p>
                          <Button 
                            onClick={() => setActiveTab("generate")} 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Video is being generated...</h3>
                          <p className="text-gray-600 mb-4">
                            {generatedVideo.title || "Your video"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {generatedVideo.status || "processing"}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No video generated yet</h3>
                      <p className="text-gray-600 mb-4">Switch to the Generate Video tab to create your first AI video</p>
                      <Button 
                        onClick={() => setActiveTab("generate")} 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Generate Video
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">1M+</div>
                <div className="text-gray-600">Videos Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See KlingAI in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how our AI transforms simple text prompts into professional-quality videos
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">Video Generation Preview</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Generating Video...</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Write Your Prompt</h3>
                  <p className="text-gray-600">Simply describe your video idea in natural language. Our AI understands context and creates accordingly.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Magic</h3>
                  <p className="text-gray-600">Kling AI generates visuals, scripts, voiceovers, and music tailored to your specifications.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Export & Share</h3>
                  <p className="text-gray-600">Get your professional video in minutes, ready for any platform or purpose.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Most Advanced AI Video Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by Kling AI technology, create professional videos with cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free, upgrade as you grow. All plans include access to Kling AI technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Manage Your Videos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your credits, manage your video library, and monitor your usage with our intuitive dashboard.
            </p>
          </div>
          
          <Card className="shadow-xl border-0">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Dashboard</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Credits remaining:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {user?.credits || 0}
                  </Badge>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">Videos Created</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <Video className="w-8 h-8 opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">Total Duration</div>
                      <div className="text-2xl font-bold">0h</div>
                    </div>
                    <Clock className="w-8 h-8 opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">This Month</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <TrendingUp className="w-8 h-8 opacity-80" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h4>
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No videos yet. Create your first video above!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about KlingAI video generation
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-sm">
                <button 
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">KlingAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Create professional AI videos from simple text prompts using cutting-edge Kling AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 KlingAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Kling AI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
