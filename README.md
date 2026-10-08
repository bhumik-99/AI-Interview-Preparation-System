# PrepAI Frontend

React/Vite frontend for the AI Interview Preparation System.

## What is included

- Responsive login/signup flow (frontend demo)
- Dashboard
- Resume upload UI
- Interview setup
- Interactive mock interview with timer and answer capture
- Results and analytics
- Interview history
- Settings
- Mock data layer ready to be replaced with Node/Express APIs
- Clear API service boundary for backend integration

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## GitHub team workflow

1. Create a GitHub repository.
2. Push this project.
3. Each teammate clones the repository and runs `npm install`.
4. Work in feature branches such as `feature/resume-upload`.
5. Merge reviewed changes into `main`.

## Vercel

Import the GitHub repository into Vercel.

Build command:
`npm run build`

Output directory:
`dist`

Environment variable:
`VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

## Backend integration

The frontend currently uses mock data. Replace functions in:

`src/services/api.js`

with calls to the Node/Express backend.

Suggested endpoints:

POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
POST   /api/resume/upload
GET    /api/resume
POST   /api/interviews
GET    /api/interviews
GET    /api/interviews/:id
POST   /api/interviews/:id/answer
POST   /api/interviews/:id/finish
GET    /api/analytics

The Python AI service can remain behind the Node/Express backend. The React app should normally communicate with the Node API rather than directly exposing AI-service credentials.
