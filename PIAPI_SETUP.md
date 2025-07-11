# PiAPI Kling AI Setup Guide

## Overview
This guide will help you set up PiAPI for Kling AI video generation, which offers the same quality as Replicate but at 90% lower cost ($0.13 vs $1.40 per 5-second video).

## Step 1: Register for PiAPI Account

1. Go to https://app.piapi.ai/
2. Sign up using your GitHub account
3. Complete the registration process
4. You'll receive free credits to test the API

## Step 2: Get Your API Key

1. After logging in, navigate to the **API Key** section
2. Generate a new API key
3. Copy and securely store your API key
4. **Never share your API key publicly**

**Direct links:**
- Main workspace: https://piapi.ai/workspace
- API Key management: https://piapi.ai/workspace/key
- Kling-specific workspace: https://piapi.ai/workspace/kling

## Step 3: Add API Key to Environment

In your Replit project, add the following environment variable:

```
KLING_AI_API_KEY=your_piapi_key_here
```

## Step 4: Pricing Information

**Standard Mode (Recommended):**
- 5-second video: $0.13
- 10-second video: $0.26

**Professional Mode:**
- 5-second video: $0.45
- 10-second video: $0.90

## Step 5: Features Available

- Text-to-video generation
- Image-to-video generation
- Multiple aspect ratios (16:9, 9:16, 1:1, 4:3)
- Duration options (5s, 10s)
- Quality modes (Standard, Professional)
- Camera controls (pan, tilt, zoom, roll)

## Step 6: Usage Limits

- Credits are valid for 180 days after purchase
- No monthly expiration like official Kling API
- Pay-as-you-go model with no upfront commitment
- No minimum purchase requirements

## Benefits vs Official Kling API

✅ **90% cheaper** than Replicate
✅ **No $4,200 upfront payment** required
✅ **Flexible pay-as-you-go** pricing
✅ **Credits don't expire monthly** (180-day validity)
✅ **Lower minimum commitment**
✅ **Additional features** and integrations

## Support

- Documentation: https://piapi.ai/docs/kling-api/create-task
- Discord community support
- Email: contact@piapi.ai
- GitHub: https://github.com/PiAPI-1/KlingAPI

## Testing

Once your API key is set up, the platform will automatically use PiAPI for video generation. If no API key is provided, it will fall back to simulation mode for testing.