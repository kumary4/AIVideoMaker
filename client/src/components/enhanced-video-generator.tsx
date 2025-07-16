import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Wand2, Palette, Video, Brain, Settings, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import AIModelSelector from "./ai-model-selector";
import VideoTemplates from "./video-templates";
import ContentRecommendationCarousel from "./content-recommendation-carousel";

interface VideoGeneratorProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

export default function EnhancedVideoGenerator({ onGenerate, isLoading }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState("cinematic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [aiModel, setAiModel] = useState("kling");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("prompt");
  const [, navigate] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const userInterests = ["marketing", "cinematic", "professional"];
  const userSubscription = user?.subscription || "free";

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate({
        prompt,
        duration,
        style,
        aspectRatio,
        aiModel,
        templateId: selectedTemplate?.id,
      });
    }
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setPrompt(template.prompt);
    setDuration(template.duration);
    setStyle(template.style);
    setAspectRatio(template.aspectRatio);
    setAiModel(template.aiModel);
    setActiveTab("prompt");
  };

  const handleRecommendationSelect = (item: any) => {
    if (item.type === "template") {
      handleTemplateSelect(item);
    } else if (item.type === "prompt") {
      setPrompt(item.description);
      setActiveTab("prompt");
    } else if (item.type === "style") {
      setStyle(item.title.toLowerCase());
      setActiveTab("prompt");
    }
  };

  const estimatedCost = duration * 0.5 * 0.13; // Based on selected AI model pricing

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Create Your Video with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from templates, customize prompts, select AI models, and create stunning videos
          </p>
        </div>

        {/* AI Recommendations */}
        <ContentRecommendationCarousel
          userInterests={userInterests}
          currentContext="video-creation"
          onItemSelect={handleRecommendationSelect}
          maxItems={8}
        />

        {/* Main Creation Interface */}
        <Card className="glass">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prompt" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Prompt</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>
                <TabsTrigger value="models" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Models</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="space-y-6">
                <div className="space-y-6">
                  {/* Selected Template Info */}
                  {selectedTemplate && (
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <Video className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Template: {selectedTemplate.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedTemplate.description}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTemplate(null)}
                          >
                            Clear
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label htmlFor="prompt" className="text-lg font-semibold">
                      Video Prompt
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the video you want to create... (e.g., 'A majestic eagle soaring through mountain peaks at sunset')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-2 min-h-[120px] text-base"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        {prompt.length}/1000 characters
                      </span>
                      <Button variant="outline" size="sm" onClick={() => setPrompt("")}>
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Quick Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                          <SelectItem value="documentary">Documentary</SelectItem>
                          <SelectItem value="animation">Animation</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                          <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                          <SelectItem value="1:1">1:1 (Square)</SelectItem>
                          <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generation Cost */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Estimated Cost</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${estimatedCost.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            {duration}s × {aiModel}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-6">
                <VideoTemplates
                  onSelectTemplate={handleTemplateSelect}
                  userSubscription={userSubscription}
                />
              </TabsContent>

              <TabsContent value="models" className="space-y-6">
                <AIModelSelector
                  selectedModel={aiModel}
                  onModelChange={setAiModel}
                  userSubscription={userSubscription}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Video Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="duration-detailed">Duration (seconds)</Label>
                        <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem value="10">10 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="style-detailed">Video Style</Label>
                        <Select value={style} onValueChange={setStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cinematic">Cinematic</SelectItem>
                            <SelectItem value="documentary">Documentary</SelectItem>
                            <SelectItem value="animation">Animation</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="educational">Educational</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="aspectRatio-detailed">Aspect Ratio</Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                            <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                            <SelectItem value="1:1">1:1 (Square)</SelectItem>
                            <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Quick Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Writing Better Prompts:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Be specific and descriptive</li>
                          <li>• Include camera angles and movements</li>
                          <li>• Mention lighting and mood</li>
                          <li>• Describe the subject clearly</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Best Practices:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Start with templates for best results</li>
                          <li>• Use higher-end models for premium quality</li>
                          <li>• Consider aspect ratio for your platform</li>
                          <li>• Keep prompts under 500 characters</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Ready to Create?</h3>
                <p className="text-sm text-muted-foreground">
                  Generate your video using {aiModel} • {duration}s • {style} style
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${estimatedCost.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estimated cost
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="gradient-primary text-lg px-8 py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Video...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}