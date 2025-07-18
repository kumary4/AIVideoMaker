import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scissors, 
  Palette, 
  Music, 
  Type, 
  Play, 
  Pause, 
  RotateCw, 
  Download,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  Filter,
  Crop,
  Move,
  MoreHorizontal,
  Loader2
} from "lucide-react";

interface AdvancedVideoEditorProps {
  videoUrl: string;
  onSave: (editingData: any) => void;
  isLoading?: boolean;
}

export default function AdvancedVideoEditor({ videoUrl, onSave, isLoading }: AdvancedVideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Editing state
  const [cuts, setCuts] = useState<Array<{ start: number; end: number; }>>([]);
  const [filters, setFilters] = useState<Array<{ type: string; intensity: number; }>>([]);
  const [textElements, setTextElements] = useState<Array<{ 
    content: string; 
    position: { x: number; y: number; }; 
    style: { color: string; fontSize: number; fontFamily: string; }; 
  }>>([]);
  const [transitions, setTransitions] = useState<Array<{ type: string; duration: number; }>>([]);
  const [musicTrack, setMusicTrack] = useState<{ url: string; volume: number; } | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = value[0];
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const addCut = () => {
    const startTime = currentTime;
    const endTime = Math.min(currentTime + 2, duration);
    setCuts([...cuts, { start: startTime, end: endTime }]);
  };

  const addFilter = (filterType: string) => {
    setFilters([...filters, { type: filterType, intensity: 50 }]);
  };

  const addTextElement = () => {
    setTextElements([...textElements, {
      content: "New Text",
      position: { x: 50, y: 50 },
      style: { color: "#ffffff", fontSize: 24, fontFamily: "Arial" }
    }]);
  };

  const handleSave = () => {
    const editingData = {
      cuts,
      filters,
      music: musicTrack,
      text: textElements,
      transitions
    };
    onSave(editingData);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filterOptions = [
    { value: "brightness", label: "Brightness", icon: <Sparkles className="h-4 w-4" /> },
    { value: "contrast", label: "Contrast", icon: <Palette className="h-4 w-4" /> },
    { value: "saturation", label: "Saturation", icon: <Filter className="h-4 w-4" /> },
    { value: "blur", label: "Blur", icon: <Zap className="h-4 w-4" /> },
    { value: "vintage", label: "Vintage", icon: <RotateCw className="h-4 w-4" /> },
    { value: "cinematic", label: "Cinematic", icon: <Layers className="h-4 w-4" /> }
  ];

  const transitionOptions = [
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "zoom", label: "Zoom" },
    { value: "dissolve", label: "Dissolve" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Video Preview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Advanced Video Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onClick={togglePlay}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Timeline Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={1}
                  step={0.1}
                  className="w-20"
                />
              </div>
              
              <div className="flex-1" />
              
              <span className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Timeline Scrubber */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={handleTimelineChange}
                max={duration}
                step={0.1}
                className="w-full"
              />
              
              {/* Cut Markers */}
              {cuts.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Scissors className="h-3 w-3" />
                  <span>{cuts.length} cuts applied</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Tools */}
      <Card className="glass">
        <CardContent className="p-6">
          <Tabs defaultValue="cuts" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cuts" className="flex items-center gap-2">
                <Scissors className="h-4 w-4" />
                <span className="hidden sm:inline">Cuts</span>
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Music</span>
              </TabsTrigger>
              <TabsTrigger value="transitions" className="flex items-center gap-2">
                <Move className="h-4 w-4" />
                <span className="hidden sm:inline">Effects</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cuts" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Video Cuts & Trimming</Label>
                <Button onClick={addCut} size="sm" variant="outline">
                  <Scissors className="h-4 w-4 mr-2" />
                  Add Cut
                </Button>
              </div>
              
              <div className="space-y-2">
                {cuts.map((cut, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <Badge variant="secondary">Cut {index + 1}</Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Start:</span>
                      <Badge variant="outline">{formatTime(cut.start)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">End:</span>
                      <Badge variant="outline">{formatTime(cut.end)}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCuts(cuts.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                {cuts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No cuts applied. Click "Add Cut" to start trimming your video.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Video Filters & Effects</Label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter.value}
                    variant="outline"
                    onClick={() => addFilter(filter.value)}
                    className="flex items-center gap-2 justify-start"
                  >
                    {filter.icon}
                    {filter.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <Badge variant="secondary">{filter.type}</Badge>
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-sm">Intensity:</Label>
                      <Slider
                        value={[filter.intensity]}
                        onValueChange={(value) => {
                          const newFilters = [...filters];
                          newFilters[index].intensity = value[0];
                          setFilters(newFilters);
                        }}
                        max={100}
                        className="flex-1"
                      />
                      <span className="text-sm w-8">{filter.intensity}%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters(filters.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Text & Overlays</Label>
                <Button onClick={addTextElement} size="sm" variant="outline">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
              </div>
              
              <div className="space-y-2">
                {textElements.map((textEl, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Text {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTextElements(textElements.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <input
                          type="text"
                          value={textEl.content}
                          onChange={(e) => {
                            const newTextElements = [...textElements];
                            newTextElements[index].content = e.target.value;
                            setTextElements(newTextElements);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Slider
                          value={[textEl.style.fontSize]}
                          onValueChange={(value) => {
                            const newTextElements = [...textElements];
                            newTextElements[index].style.fontSize = value[0];
                            setTextElements(newTextElements);
                          }}
                          min={12}
                          max={48}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="music" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Background Music</Label>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Music Library</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose background music" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upbeat">Upbeat Corporate</SelectItem>
                        <SelectItem value="cinematic">Cinematic Drama</SelectItem>
                        <SelectItem value="ambient">Ambient Chill</SelectItem>
                        <SelectItem value="electronic">Electronic Beat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Volume</Label>
                    <Slider
                      value={[musicTrack?.volume || 50]}
                      onValueChange={(value) => setMusicTrack(prev => prev ? {...prev, volume: value[0]} : null)}
                      max={100}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {musicTrack && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <span className="text-sm">Background music added</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMusicTrack(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transitions" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Transitions & Effects</Label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {transitionOptions.map((transition) => (
                  <Button
                    key={transition.value}
                    variant="outline"
                    onClick={() => setTransitions([...transitions, { type: transition.value, duration: 0.5 }])}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Move className="h-4 w-4" />
                    {transition.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                {transitions.map((transition, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <Badge variant="secondary">{transition.type}</Badge>
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-sm">Duration:</Label>
                      <Slider
                        value={[transition.duration]}
                        onValueChange={(value) => {
                          const newTransitions = [...transitions];
                          newTransitions[index].duration = value[0];
                          setTransitions(newTransitions);
                        }}
                        min={0.1}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-sm w-8">{transition.duration}s</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTransitions(transitions.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Controls */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Save Your Edits</h3>
              <p className="text-sm text-muted-foreground">
                Apply all changes and regenerate your video with edits
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reset All
              </Button>
              
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="gradient-primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Save & Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}