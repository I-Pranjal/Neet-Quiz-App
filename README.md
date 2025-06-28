# Gemini‑powered NCERT MCQ Quiz (MERN + Vite)

## Quick Start

```bash
git clone <repo-or-download>
cd gemini-quiz-app
cp .env.example .env      # add your GEMINI_API_KEY
npm install
cd client && npm install  # install client deps
cd ..
npm run dev               # start both Vite and server with concurrently
```

The client runs on <http://localhost:5173> and proxies API requests to the Express server on port **5000**.

When you're ready for production:

```bash
npm run build   # builds client
NODE_ENV=production npm start
```

The Express server will serve the static build from `client/dist`.
