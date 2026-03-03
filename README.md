# Bayan

Bayan is an Arabic-first web application for analyzing legal and regulatory documents with Google Gemini. It helps users turn long policy text into simplified summaries, obligations, penalties, FAQs, and follow-up answers through a focused chat experience.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | UI rendering and state-driven views |
| Frontend Build Tool | Vite 7 | Development server and production build |
| Backend | Node.js + Express | Local API layer for Gemini requests |
| AI Integration | Google Gemini (`@google/genai`) | Document analysis and chat responses |
| Styling | Plain CSS | Custom UI styling and theme support |
| Tooling | ESLint | Code quality checks |
| Runtime Config | dotenv | Environment variable loading |

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A valid Google Gemini API key

## Setup Instructions

1. Clone the repository.

```bash
git clone <your-repo-url>
cd bayan
```

2. Install dependencies.

```bash
npm install
```

3. Create your local environment file.

Recommended location:
- `backend/.env.local`

Example:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Notes:
- The backend also supports a root-level `.env.local`, but `backend/.env.local` is cleaner for this structure.
- Do not commit your real API key.

4. Start the project.

```bash
npm run dev
```

This runs:
- the Vite frontend
- the Express backend

5. Open the app in your browser.

By default, Vite will expose a local development URL such as:

```text
http://localhost:5173
```

## Project Structure

```text
bayan/
├── backend/
│   ├── .env.example
│   └── src/
│       └── index.js
├── frontend/
│   ├── index.html
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── bayan/
│   │       ├── BayanPage.jsx
│   │       ├── BayanUI.jsx
│   │       ├── bayanService.js
│   │       └── bayanStorage.js
│   └── vite.config.js
├── .env.example
├── package.json
└── README.md
```

### Structure Notes

- `frontend/src/bayan/BayanPage.jsx`: page-level state and handlers
- `frontend/src/bayan/BayanUI.jsx`: presentational UI and internal view components
- `frontend/src/bayan/bayanService.js`: frontend API client for local backend endpoints
- `frontend/src/bayan/bayanStorage.js`: local history persistence
- `backend/src/index.js`: Express server and Gemini integration

## Features

- Analyze Arabic legal or regulatory text into structured JSON output
- Upload and analyze PDF or TXT files
- Generate simplified summaries for easier reading
- Extract obligations and possible penalties
- Generate frequently asked questions from the analyzed document
- Ask follow-up questions in a contextual chat view
- View and manage local analysis history
- Switch between dark and light themes
- Keep the Gemini API key on the backend instead of exposing it in the browser

## Available Scripts

```bash
npm run dev
```

Starts frontend and backend together for local development.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the built frontend.

```bash
npm run lint
```

Runs ESLint across the project.
