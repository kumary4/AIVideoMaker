import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  aspectRatio?: string;
  onDownload?: () => void;
}

export default function VideoPlayer({ 
  videoUrl, 
  thumbnailUrl, 
  title, 
  aspectRatio,
  onDownload 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / duration) * 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-black group rounded-t-xl overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full aspect-video object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Main Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-200"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
        </div>
        
        {/* Bottom Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20 p-1.5 rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            {/* Time Display */}
            <span className="text-xs text-white/90 font-medium min-w-[2.5rem]">
              {formatTime(currentTime)}
            </span>
            
            {/* Progress Bar */}
            <div
              className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer group/progress"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-200 group-hover/progress:bg-purple-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Duration */}
            <span className="text-xs text-white/90 font-medium min-w-[2.5rem]">
              {formatTime(duration)}
            </span>
            
            {/* Volume Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 p-1.5 rounded-full"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Kling AI Watermark */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs text-white/90 font-medium">Kling AI</span>
        </div>
      </div>
      
      {/* Video Info Section */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              Video from "{title}"
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatTime(duration)} • {aspectRatio || "16:9"}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              try {
                // Fetch the video and create a blob for download
                const response = await fetch(videoUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = `${title}.mp4`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the blob URL
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Download failed:', error);
                // Fallback to direct link
                const link = document.createElement('a');
                link.href = videoUrl;
                link.download = `${title}.mp4`;
                link.target = '_blank';
                link.click();
              }
            }}
            className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
