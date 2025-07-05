import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Video, Clock, TrendingUp, Download, Eye, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos'],
    enabled: !!user,
  });

  if (!user) {
    navigate('/');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalVideos = videos?.length || 0;
  const totalDuration = videos?.reduce((sum: number, video: any) => sum + video.duration, 0) || 0;
  const thisMonthVideos = videos?.filter((video: any) => {
    const videoDate = new Date(video.createdAt);
    const now = new Date();
    return videoDate.getMonth() === now.getMonth() && videoDate.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your videos and track your usage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Credits Remaining</p>
                  <p className="text-2xl font-bold text-purple-600">{user.credits}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Videos Created</p>
                  <p className="text-2xl font-bold text-blue-600">{totalVideos}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(totalDuration / 60)}m</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-orange-600">{thisMonthVideos}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Videos List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Videos</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Create New Video
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading videos...</p>
              </div>
            ) : !videos || videos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No videos yet. Create your first video!</p>
                <Button onClick={() => navigate('/')}>
                  Create Video
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {videos.map((video: any) => (
                  <div key={video.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
                    <div className="w-16 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{video.title}</div>
                      <div className="text-sm text-gray-600">{video.duration} seconds</div>
                      <div className="text-xs text-gray-500">
                        Created {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(video.status)}>
                        {video.status}
                      </Badge>
                      {video.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {video.status === 'generating' && (
                        <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  Current Plan: <span className="capitalize">{user.subscription}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {user.credits} credits remaining
                </p>
              </div>
              {user.subscription === 'free' && (
                <Button onClick={() => navigate('/subscribe')}>
                  Upgrade Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
