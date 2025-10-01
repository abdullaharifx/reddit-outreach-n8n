# Netlify Deployment Guide

## Prerequisites
1. Push your code to GitHub/GitLab
2. Have a Netlify account
3. Have your n8n webhook URL ready

## Deployment Steps

### 1. Connect Repository
- Login to Netlify
- Click "New site from Git"
- Connect your GitHub/GitLab repository
- Select `reddit-outreach-n8n` repository

### 2. Build Settings
- **Base directory**: `app`
- **Build command**: `npm run build`
- **Publish directory**: `app/build`

### 3. Environment Variables
Set these in Netlify Dashboard > Site Settings > Environment Variables:

```
REACT_APP_N8N_BASE_URL=http://localhost:5678/webhook/18ea1485-beab-4bca-b320-f3686bc7e611
REACT_APP_N8N_API_KEY=your-optional-api-key
```

### 4. Deploy
- Click "Deploy Site"
- Wait for build to complete
- Your app will be available at: `https://redditoutreach.netlify.app`

## Important Notes
- Make sure your n8n instance is accessible from the internet (not localhost)
- Update CORS settings in n8n to allow your Netlify domain
- Test all API endpoints after deployment

## Local Development
```bash
cd app
npm install
npm start
```

## Testing Local Build
```bash
cd app
npm run build
npm install -g serve
serve -s build
```

## Environment Setup
1. Copy `.env.example` to `.env`
2. Update environment variables with your n8n webhook URL
3. For production, set environment variables in Netlify dashboard

## Features
- ✅ Authentication system with demo mode
- ✅ Product management (CRUD operations)
- ✅ Comment approval dashboard
- ✅ Analytics dashboard (coming soon)
- ✅ Settings management (coming soon)
- ✅ Responsive design
- ✅ Client-side routing
- ✅ API integration with n8n webhooks