This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
[AI Generative Agent Assistant Frontend]

This is a Next.js frontend for the AI Generative Agent Assistant project.

## Features
- Modern, attractive UI with animated hero section
- Glassmorphism cards and generative AI theme
- Project structure creation
- GitHub repo suggestions
- YouTube video suggestions
- Research paper PDF download
- Related research papers
- Real-time updates via SSE/WebSocket

## Tech Stack
- Next.js (JavaScript)
- Tailwind CSS
- REST API integration with FastAPI backend
- Event/stream support

## How to Run

### 1. Start Backend (FastAPI)
- Make sure your FastAPI backend is running (see backend README for details)

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the App
- Open [http://localhost:3000](http://localhost:3000) in your browser

## Integration
- Update API URLs in frontend to point to your FastAPI backend (default: http://localhost:8000)
- For streaming/event endpoints, use SSE/WebSocket client in Next.js

---

This project is designed to highlight the power of generative AI agents with a unique, beautiful frontend experience.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
