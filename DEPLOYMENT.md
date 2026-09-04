# Deploy MedFlowAI: Vercel + Render

The frontend is deployed to **Vercel** and the Express API to **Render**. The Vercel app proxies every `/api/*` request to Render, so the browser continues to use the existing relative API URLs and HttpOnly authentication cookies.

## 1. Prepare production services

Create these services before deploying:

- MongoDB Atlas database and connection string
- Qdrant Cloud cluster
- Cloudinary account
- Groq API key
- Google Gemini API key

Never commit real keys. `Backend/.env` remains local-only and is ignored by Git.

## 2. Deploy the backend to Render

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository. Render will read `render.yaml`.
3. Enter the values marked `sync: false` from `Backend/.env.example` in the Render dashboard.
4. Set `FRONTEND_URLS` after your Vercel URL exists, for example: `https://medflowai.vercel.app`.
5. Deploy and confirm `https://YOUR-RENDER-SERVICE.onrender.com/health` returns a healthy JSON response.

Render automatically supplies a port, but the blueprint explicitly works with Render’s default `10000` port too.

## 3. Deploy the frontend to Vercel

1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `Frontend`.
3. Set the environment variable below for **Production**, **Preview**, and **Development**:

   ```env
   BACKEND_URL=https://YOUR-RENDER-SERVICE.onrender.com
   ```

4. Deploy. Vercel automatically detects Next.js and runs `npm run build`.
5. Copy the deployed Vercel URL into Render’s `FRONTEND_URLS`, then redeploy the Render service.

## 4. Verify the deployed app

1. Visit the Vercel URL and register or log in.
2. Confirm requests in browser DevTools go to `https://YOUR-VERCEL-APP.vercel.app/api/...`, not directly to Render.
3. Check that login remains active after a refresh.
4. Test patient search, a Knowledge Copilot query, and an admin document upload.

## Required production environment variables

Use `Backend/.env.example` as the source of truth. At minimum, Render needs:

```env
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=a_long_random_secret
COOKIE_NAME=mycookie
FRONTEND_URLS=https://your-vercel-project.vercel.app
GROQ_API_KEY=...
GEMINI_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Optional email delivery requires `SMTP_USER`, `SMTP_PASS`, and `SENDER_EMAIL`.
