# Oxyra — Deployment Guide

## Step 1 — Install dependencies
```bash
npm install
```

## Step 2 — Add Stripe keys
Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
NEXT_PUBLIC_URL=https://your-domain.vercel.app
```
Get keys from: https://dashboard.stripe.com/apikeys

## Step 3 — Test locally
```bash
npm run dev
```
Open http://localhost:3000

## Step 4 — Push to GitHub
```bash
git init
git add .
git commit -m "Oxyra store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/oxyra.git
git push -u origin main
```

## Step 5 — Deploy to Vercel
1. Go to vercel.com/new
2. Import your GitHub repo
3. Add environment variables (Settings → Environment Variables):
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - NEXT_PUBLIC_URL (your vercel URL)
4. Click Deploy

## Step 6 — Add Stripe keys on Vercel
In Vercel project settings → Environment Variables, add your Stripe keys.
Then redeploy.
