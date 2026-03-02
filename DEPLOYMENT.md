# Sentinals Deployment Guide 🚀

The project is fully built and production-ready. We will use **Vercel** for the frontend and **Railway** for the backend + database. Both have generous free tiers and are industry standards for modern stack deployments.

---

## Part 1: Source Control Setup

1. Go to [GitHub](https://github.com/) and create a new private repository called `sentinals`
2. Open terminal in the project root (`D:\_PROJECT\Sentinals`) and run:
   ```bash
   git init
   git add .
   git commit -m "Initial production commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sentinals.git
   git push -u origin main
   ```

---

## Part 2: Backend & Database (Railway)

Railway is perfect for the NestJS API and PostgreSQL database because it automatically handles Docker builds and internal networking.

1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `sentinals` repository.
4. Railway will scan the repo. 

### A. Deploy PostgreSQL & Redis
1. In your Railway project, click **+ New** → **Database** → **Add PostgreSQL**.
2. Click **+ New** → **Database** → **Add Redis**.

### B. Configure the API Service
1. Click on the Github service that was created (this will be your API).
2. Go to **Settings** → **Deploy**.
3. Change the **Root Directory** to `/apps/api`.
4. Railway will automatically detect the Dockerfile in `apps/api`.
5. Go to the **Variables** tab and set the following:
   - `DATABASE_URL`: *(Click "Reference Variable" and select the one from the PostgreSQL plugin)*
   - `REDIS_URL`: *(Click "Reference Variable" and select Redis)*
   - `JWT_SECRET`: `your_secure_random_string`
   - `NODE_ENV`: `production`
   - `CORS_ORIGINS`: `https://YOUR_VERCEL_DOMAIN.vercel.app` *(You'll set this later)*
   - `GOOGLE_CLIENT_ID`: `81180339...`
   - `GOOGLE_CLIENT_SECRET`: `GOCSPX-...`
6. Go to **Settings** → **Networking** → Click **Generate Domain**.
   *(Copy this domain — e.g., `sentinals-api-production.up.railway.app`)*

---

## Part 3: Frontend Web App (Vercel)

Vercel is optimized for Next.js and provides instant global CDN deployments.

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New Project** and import your `sentinals` repository.
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `apps/web`
4. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: `https://YOUR_RAILWAY_DOMAIN.up.railway.app/api`
   - `NEXT_PUBLIC_APP_NAME`: `Sentinals`
5. Click **Deploy**. Vercel will build and assign you a URL (e.g., `sentinals.vercel.app`).

---

## Part 4: Final Glue

### 1. Update Backend CORS
Go back to Railway Variables for the API and update `CORS_ORIGINS` to your exact Vercel URLs (e.g., `https://sentinals.vercel.app`).

### 2. Update Google OAuth Redirect
Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
Under "Authorized redirect URIs", update the URL to your Railway backend:
`https://YOUR_RAILWAY_DOMAIN.up.railway.app/api/v1/auth/google/callback`

### 3. Initialize the Database
1. Go to Railway → PostgreSQL → **Connect**.
2. Copy the connection string.
3. In your local terminal, run the Prisma migration against production:
   ```bash
   cd apps/api
   $env:DATABASE_URL="YOUR_RAILWAY_POSTGRES_URL"; npx prisma db push
   ```

## You're Live! 🌍
Your enterprise-grade architecture is now fully deployed:
- **Client**: Static CDN delivery via Vercel Edge Network
- **API**: Dockerized Node.js cluster on Railway
- **Data**: Managed PostgreSQL + Redis
- **Auth**: Secure JWT with Google OAuth integration
