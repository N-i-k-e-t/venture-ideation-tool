# Deployment Guide for Venture Ideation Tool

This guide will help you deploy the AI-powered startup venture ideation tool to Vercel for a limited audience.

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier is available)
- Your OpenAI API key

## Step 1: Push to GitHub

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

## Step 2: Deploy to Vercel

1. Sign up or log in to [Vercel](https://vercel.com)

2. Import your GitHub repository:
   - Click "Add New" > "Project"
   - Connect your GitHub account if not already connected
   - Select the repository you just created
   - Vercel will automatically detect the project settings

3. Configure the deployment settings:
   - In the "Build and Output Settings" section:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   
   - In the "Environment Variables" section, add:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
     - Add as a Secret (do not expose in logs)

4. Click "Deploy"

## Step 3: Access Control for Limited Audience

To limit access to your deployed application:

1. In the Vercel dashboard, go to your project settings

2. Enable Password Protection:
   - Go to "Settings" > "General" > "Password Protection"
   - Toggle to enable password protection
   - Set a username and password
   - Click "Save"

3. Alternatively, use Vercel's Preview URLs:
   - Each deployment creates a unique URL
   - These URLs are not easily discoverable
   - Share these URLs only with intended users

## Step 4: Custom Domain (Optional)

If you want a more professional URL:

1. In the Vercel dashboard, go to "Settings" > "Domains"
2. Add your domain name
3. Follow the instructions to configure DNS settings

## Troubleshooting

If you encounter any issues during deployment:

- Check Vercel's deployment logs for errors
- Ensure your OpenAI API key is valid and has sufficient credits
- Make sure all required environment variables are properly set

## Maintenance

To update your deployed application:

1. Make changes to your local project
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Vercel will automatically detect changes and redeploy your application