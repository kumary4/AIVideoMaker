import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

interface VideoGeneratorProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

export default function VideoGenerator({ onGenerate, isLoading }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState("cinematic");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const { data: user } = useQuery<any>({
    queryKey: ['/api/me'],
    retry: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate({
      prompt,
      duration,
      style,
      aspectRatio,
    });
  };

  const creditsNeeded = duration <= 5 ? 1 : 2; // 1 credit for 5s, 2 credits for 10s

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <Card className="shadow-xl border-0">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="prompt" className="text-base font-medium text-gray-900 mb-3 block">
                Describe your video idea
              </Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Create a 60-second promotional video about sustainable fashion featuring young models in eco-friendly clothing..."
                className="min-h-[100px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                maxLength={1000}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {prompt.length}/1000 characters
                </span>
                <span className="text-sm text-gray-500">
                  {creditsNeeded} credit{creditsNeeded !== 1 ? 's' : ''} needed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 block">
                  Duration
                </Label>
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
                <Label htmlFor="style" className="text-sm font-medium text-gray-700 mb-2 block">
                  Style
                </Label>
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
                <Label htmlFor="aspect-ratio" className="text-sm font-medium text-gray-700 mb-2 block">
                  Aspect Ratio
                </Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-opacity"
              disabled={isLoading || !prompt.trim() || (user && user?.credits < creditsNeeded)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Video ({creditsNeeded} Credit{creditsNeeded !== 1 ? 's' : ''})
                </>
              )}
            </Button>

            {user && user?.credits < creditsNeeded && (
              <p className="text-sm text-red-600 text-center">
                Insufficient credits. You need {creditsNeeded} credits but only have {user?.credits}.
              </p>
            )}

            {!user && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Sign up to start generating videos with AI!
                </p>
                <p className="text-xs text-gray-500">
                  Create a free account to get 5 credits and start making videos
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
