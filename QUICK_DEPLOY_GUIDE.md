# Quick Deployment Guide for Venture Ideation Tool

This is a simplified guide for deploying your venture ideation tool to Render's free tier.

## Step 1: Set Up GitHub Repository

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com) and sign in
   - Create a new repository named "venture-ideation-tool"
   - Make it public (for easier Render integration)

2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/venture-ideation-tool.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Render

1. Create a free Render account at [render.com](https://render.com)

2. From the Render dashboard, click **"New Web Service"**

3. Select GitHub as your deployment method and connect your account

4. Find and select your venture-ideation-tool repository

5. Configure your service with these exact settings:
   - **Name**: venture-ideation-tool
   - **Environment**: Node
   - **Region**: Choose the closest to your target audience
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `NODE_ENV=production npm start`
   - **Plan**: Free

6. Add these environment variables (click "Advanced" before creating):
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: production
   - `PORT`: 10000

7. Click **"Create Web Service"**

8. Wait for deployment (5-10 minutes for first deploy)

## Step 3: Test Your Deployment

1. After deployment completes, click the URL provided by Render
   - It will look like `https://venture-ideation-tool.onrender.com`

2. Verify that the application loads correctly

3. Test creating a venture and running through the ideation process

## Step 4: Share With Others

1. The URL provided by Render can be shared with anyone

2. Note that on the free tier:
   - The application will sleep after 15 minutes of inactivity
   - The first request after inactivity may take 30-60 seconds to load

## Troubleshooting

If you encounter issues:

1. Check Render's logs by clicking on your service and selecting "Logs"

2. Verify your environment variables are set correctly 

3. Make sure your OpenAI API key has sufficient credits

## Next Steps

For a more reliable deployment:

1. Consider upgrading to Render's paid tier (starts at $7/month)
   - This eliminates the sleep behavior on the free tier
   - Provides more resources and improved performance

2. Set up a custom domain through Render's dashboard