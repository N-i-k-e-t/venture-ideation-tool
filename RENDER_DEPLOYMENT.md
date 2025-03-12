# Deploying Venture Ideation Tool to Render

This guide provides step-by-step instructions for deploying your AI-powered venture ideation tool to Render's free tier.

## Why Render?

Render is an excellent choice for deploying this application because:
- **Generous Free Tier**: 750 hours of runtime per month (enough for continuous operation)
- **Easy Setup**: Simple GitHub integration with automatic deployments
- **SSL Included**: Free HTTPS for all services
- **No Credit Card Required**: For the free tier
- **Sleek Dashboard**: Easy monitoring of your deployment

## Prerequisites

- A [GitHub](https://github.com) account
- A [Render](https://render.com) account (sign up for free)
- Your OpenAI API key

## Deployment Steps

### Step 1: Push to GitHub

1. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" in the top right corner and select "New repository"
   - Name your repository (e.g., "venture-ideation-tool")
   - Choose whether to make it public or private
   - Click "Create repository"

2. Initialize Git in your project if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/venture-ideation-tool.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Render

#### Option 1: Deploy via Dashboard (Easiest)

1. Sign up or log in to [Render](https://render.com)

2. From your dashboard, click **"New +"** and select **"Web Service"**

3. Connect your GitHub account if not already connected

4. Find and select your repository

5. Configure your web service:
   - **Name**: "venture-ideation-tool" (or your preferred name)
   - **Environment**: "Node"
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add the environment variable:
   - Click "Advanced" to expand advanced options
   - Under "Environment Variables" add:
     - **Key**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key

7. Click "Create Web Service"

#### Option 2: Deploy Using render.yaml (More Automated)

1. Make sure the `render.yaml` file is in your repository's root directory

2. Sign up or log in to [Render](https://render.com)

3. From your dashboard, click **"New +"** and select **"Blueprint"**

4. Connect your GitHub account if not already connected

5. Find and select your repository

6. Render will automatically detect the render.yaml file and set up your service

7. You'll need to manually add your OpenAI API key as a secret

8. Click "Apply" to create your service

### Step 3: Monitor Deployment

1. Render will now build and deploy your application
   - This may take a few minutes for the initial deployment

2. Once deployed, you'll see a URL where your application is hosted
   - It will look like `https://venture-ideation-tool.onrender.com`

3. You can monitor logs and deployment status from the Render dashboard

### Step 4: Custom Domain (Optional)

1. In the Render dashboard, go to your web service

2. Click on "Settings" and then scroll to "Custom Domain"

3. Click "Add Custom Domain" and follow the instructions
   - You'll need to update DNS records at your domain registrar

## Usage Limitations

On Render's free tier:
- Your service will be automatically spun down after 15 minutes of inactivity
- When a new request comes in, it will spin back up (may take ~30 seconds for the first request)
- You get 750 hours of runtime per month

## Troubleshooting

If you encounter any issues during deployment:

- **Build Failures**: Check the build logs in the Render dashboard
- **Application Errors**: View the runtime logs in the dashboard
- **OpenAI Issues**: Verify your API key is valid and has sufficient credits
- **Slow Initial Load**: This is normal for the free tier as your app "wakes up"

## Upgrading

If you need more reliability or performance:
- Consider upgrading to Render's paid tier starting at $7/month
- This eliminates the spin-down behavior and provides more resources

## Maintenance

To update your deployed application:

1. Make changes to your local project
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Render will automatically detect changes and redeploy your application