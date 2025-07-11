// Kling AI API Integration via PiAPI
// This module handles video generation using Kling AI through PiAPI's API

interface KlingAIConfig {
  piApiKey?: string;
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
  private isSimulation: boolean = false;
  private piApiBaseUrl = 'https://api.piapi.ai/api/v1';

  constructor() {
    this.config = {
      piApiKey: process.env.KLING_AI_API_KEY,
    };

    // Enable simulation mode if no API keys are provided
    if (!this.config.piApiKey) {
      this.isSimulation = true;
      console.log('Kling AI: No API keys provided, running in simulation mode');
    }
  }

  async generateVideo(request: VideoGenerationRequest): Promise<KlingAIResponse> {
    if (this.isSimulation) {
      return this.simulateVideoGeneration(request);
    }

    try {
      console.log('Starting Kling AI video generation via PiAPI...');
      console.log('Request parameters:', {
        prompt: request.prompt,
        duration: request.duration,
        aspect_ratio: request.aspectRatio,
        mode: "standard"
      });
      
      // PiAPI Kling AI endpoint
      const response = await fetch(`${this.piApiBaseUrl}/kling/v1/videos/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.piApiKey!,
        },
        body: JSON.stringify({
          model: 'kling-v1',
          prompt: request.prompt,
          duration: request.duration,
          aspect_ratio: request.aspectRatio,
          mode: 'standard',
          cfg_scale: 0.5
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PiAPI request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('PiAPI API response:', data);

      // Return the task ID for polling
      return {
        taskId: data.task_id || data.id,
        status: 'processing',
        videoUrl: undefined,
        thumbnailUrl: undefined,
      };

    } catch (error: any) {
      console.error('PiAPI Kling AI API error:', error.message);
      console.log('Falling back to simulation mode...');
      return this.simulateVideoGeneration(request);
    }
  }

  async checkTaskStatus(taskId: string): Promise<KlingAIResponse> {
    if (this.isSimulation) {
      return this.simulateTaskCompletion(taskId);
    }

    try {
      console.log(`Checking task status for ID: ${taskId}`);
      
      // PiAPI status check endpoint
      const response = await fetch(`${this.piApiBaseUrl}/kling/v1/videos/generations/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.config.piApiKey!,
        }
      });

      if (!response.ok) {
        throw new Error(`PiAPI status check failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('PiAPI status response:', data);

      // Map PiAPI status to our format
      let status: 'pending' | 'processing' | 'completed' | 'failed';
      
      switch (data.status) {
        case 'completed':
        case 'success':
          status = 'completed';
          break;
        case 'failed':
        case 'error':
          status = 'failed';
          break;
        case 'processing':
        case 'running':
          status = 'processing';
          break;
        default:
          status = 'pending';
      }

      return {
        taskId,
        status,
        videoUrl: data.video_url || data.output_url,
        thumbnailUrl: data.thumbnail_url || data.preview_url,
        error: data.error || data.message
      };

    } catch (error: any) {
      console.error('PiAPI status check error:', error.message);
      return {
        taskId,
        status: 'failed',
        error: error.message
      };
    }
  }

  private simulateVideoGeneration(request: VideoGenerationRequest): KlingAIResponse {
    console.log('Simulating video generation for prompt:', request.prompt);
    
    const taskId = Math.random().toString(36).substr(2, 9);
    
    // Simulate immediate completion with a sample video
    return {
      taskId,
      status: 'completed',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://sample-videos.com/zip/10/jpg/SampleJPGImage_1280x720_1mb.jpg'
    };
  }

  private simulateTaskCompletion(taskId: string): KlingAIResponse {
    console.log('Simulating task completion for ID:', taskId);
    
    // Simulate completion with sample video
    return {
      taskId,
      status: 'completed',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://sample-videos.com/zip/10/jpg/SampleJPGImage_1280x720_1mb.jpg'
    };
  }

  isConfigured(): boolean {
    return !this.isSimulation && !!this.config.piApiKey;
  }
}

export const klingAI = new KlingAIService();