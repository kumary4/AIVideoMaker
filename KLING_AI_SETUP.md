# Kling AI Setup Guide

## Overview
This guide explains how to set up the official Kling AI API integration for your video generation platform.

## Current Status
- **Simulation Mode**: Currently active - generates mock videos instantly
- **Production Mode**: Ready for official Kling AI API integration

## Getting Official Kling AI API Access

### Official Kling AI API
Based on the latest documentation (updated June 2025), Kling AI provides official API access:

1. **Sign up at**: https://klingai.com or https://app.klingai.com
2. **Navigate to**: Developer/API section in your dashboard
3. **Generate API key**: Create your authentication token
4. **Get documentation**: Access the official API docs

### Official API Endpoint
- **Base URL**: `https://api-singapore.klingai.com`
- **Latest Model**: Kling V2.1 (supports both text-to-video and image-to-video)
- **Max Duration**: Up to 60 seconds for lip-sync, 10 seconds for standard generation

## Configuration

Add these environment variables to your Replit Secrets:

```bash
KLING_AI_API_KEY=your_official_kling_api_key
KLING_AI_BASE_URL=https://api-singapore.klingai.com
```

## API Integration Details

The platform is pre-configured to use the official Kling AI API format:

### Supported Features (Official API)
- **Latest Model**: Kling V2.1 with enhanced capabilities
- **Text-to-video**: Generate videos from text prompts
- **Multiple Modes**: Standard (std) and Professional (pro) modes
- **Aspect Ratios**: 16:9, 9:16, 1:1, 4:3, 21:9
- **Duration**: 5-10 seconds standard, up to 60 seconds for lip-sync
- **Camera Controls**: Simple camera movement controls
- **Quality**: High-definition output with improved aesthetics

### API Request Format
The platform uses the official format:
```json
{
  "model_name": "kling-v2-1",
  "prompt": "your video prompt",
  "negative_prompt": "",
  "cfg_scale": 0.5,
  "mode": "std",
  "duration": 5,
  "aspect_ratio": "16:9",
  "camera_control": {
    "type": "simple",
    "config": {
      "horizontal": 0,
      "vertical": 0,
      "pan": 0,
      "tilt": 0,
      "roll": 0,
      "zoom": 0
    }
  }
}
```

### Error Handling
- Automatic fallback to simulation if API fails
- Comprehensive error logging and user feedback
- Graceful handling of rate limits and API errors

## Testing

To test the official API integration:
1. Add your official Kling AI API credentials to Replit Secrets
2. Generate a test video from the dashboard
3. Check server logs for API communication
4. Verify real video generation completes successfully

## Troubleshooting

### Common Issues
- **"Simulation mode active"**: API key not configured in Replit Secrets
- **"API error"**: Check credentials and ensure they're from official Kling AI
- **"Rate limit exceeded"**: Check your Kling AI account limits
- **"Video generation failed"**: Verify prompt meets content guidelines

### Debug Steps
1. Verify API key is correctly set in Replit Secrets
2. Ensure you're using the official Kling AI API key (not third-party)
3. Check server console logs for detailed error messages
4. Test with simple prompts first (under 2500 characters)
5. Verify your Kling AI account has sufficient credits

## Official Features Available

Based on the latest Kling AI updates (June 2025):

### Video Generation
- **V2.1 Model**: Latest with improved quality and speed
- **Lip-Sync**: Support for 60-second videos with facial animation
- **Video Effects**: Special effects like dual-character effects
- **Multi-Image to Video**: Generate from up to 4 images
- **Video Extension**: Extend videos by 4-5 seconds

### Image Generation
- **V2.0 Model**: High-quality image generation
- **Resolutions**: 1K, 2K options
- **Image Expansion**: Expand existing images
- **Character Consistency**: Face and subject reference features

## Cost Considerations

- Official API charges based on video duration and quality
- Professional mode costs more than standard mode
- Longer videos (up to 60 seconds) cost more credits
- Monitor usage through your Kling AI dashboard

## Next Steps

1. **Get Official API Access**: Sign up at https://klingai.com
2. **Configure Secrets**: Add official API key to Replit Secrets
3. **Test Integration**: Generate test videos with real API
4. **Monitor Usage**: Track costs through Kling AI dashboard
5. **Optimize**: Fine-tune parameters for best quality/cost ratio

## Benefits of Official API

- **Latest Features**: Access to newest models and capabilities
- **Best Quality**: Direct access to Kling AI's latest technology
- **Reliability**: Official support and documentation
- **Future-Proof**: Guaranteed updates and new features