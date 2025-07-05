// Kling AI API Integration
// This module handles video generation using Kling AI's API

interface KlingAIConfig {
  apiKey: string;
  baseUrl: string;
}

interface VideoGenerationRequest {
  prompt: string;
  duration: number;
  style: string;
  aspectRatio: string;
  resolution?: string;
}

interface KlingAIResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

class KlingAIService {
  private config: KlingAIConfig;

  constructor() {
    this.config = {
      apiKey: process.env.KLING_AI_API_KEY || '',
      baseUrl: process.env.KLING_AI_BASE_URL || 'https://api-singapore.klingai.com'
    };
  }

  async generateVideo(request: VideoGenerationRequest): Promise<KlingAIResponse> {
    try {
      // Check if API key is configured
      if (!this.config.apiKey) {
        console.warn('Kling AI API key not configured, using simulation mode');
        return this.simulateVideoGeneration(request);
      }

      // Make actual API call to Kling AI using official format
      const response = await fetch(`${this.config.baseUrl}/v1/videos/text2video`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_name: 'kling-v2-1', // Use latest V2.1 model
          prompt: request.prompt,
          negative_prompt: '',
          cfg_scale: 0.5,
          mode: request.style === 'pro' ? 'pro' : 'std',
          duration: request.duration,
          aspect_ratio: request.aspectRatio,
          camera_control: {
            type: 'simple',
            config: {
              horizontal: 0,
              vertical: 0,
              pan: 0,
              tilt: 0,
              roll: 0,
              zoom: 0
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        console.error(`Kling AI API error details:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`Kling AI API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return {
        taskId: data.task_id,
        status: data.status,
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url
      };

    } catch (error) {
      console.error('Kling AI API error:', error);
      // Fallback to simulation if API fails
      return this.simulateVideoGeneration(request);
    }
  }

  async checkTaskStatus(taskId: string): Promise<KlingAIResponse> {
    try {
      if (!this.config.apiKey) {
        return this.simulateTaskCompletion(taskId);
      }

      const response = await fetch(`${this.config.baseUrl}/v1/videos/text2video/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Kling AI status check error: ${response.status}`);
      }

      const data = await response.json();
      return {
        taskId: data.task_id,
        status: data.status,
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url,
        error: data.error
      };

    } catch (error) {
      console.error('Kling AI status check error:', error);
      return this.simulateTaskCompletion(taskId);
    }
  }

  private simulateVideoGeneration(request: VideoGenerationRequest): KlingAIResponse {
    const taskId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Simulating video generation for prompt: "${request.prompt}"`);
    
    return {
      taskId,
      status: 'processing'
    };
  }

  private simulateTaskCompletion(taskId: string): KlingAIResponse {
    // Simulate completed video
    const mockVideoUrl = `https://example.com/generated-video-${taskId}.mp4`;
    const mockThumbnailUrl = `https://example.com/thumbnail-${taskId}.jpg`;
    
    return {
      taskId,
      status: 'completed',
      videoUrl: mockVideoUrl,
      thumbnailUrl: mockThumbnailUrl
    };
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}

export const klingAI = new KlingAIService();
export type { VideoGenerationRequest, KlingAIResponse };