# SmartFlow Lead Engine

AI-powered lead generation system for **SmartFlow Suisse**. Analyze Swiss business websites, score leads, identify automation opportunities, and manage your CRM pipeline.

## Features

- **Lead Database** — Store companies with website, email, phone, city, industry, lead score, and CRM status
- **AI Website Analysis** — Evaluate website quality, mobile friendliness, page speed, SEO basics, contact forms, and trust elements
- **Lead Scoring (0–100)** — Automatic scoring with quick wins and SmartFlow automation opportunity detection
- **CRM Pipeline** — Kanban board with stages: New Lead → Analyzed → Contacted → Follow Up → Proposal Sent → Client
- **Dashboard** — Statistics, lead counts, conversion tracking, and pipeline overview

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLite](https://www.sqlite.org/) via `better-sqlite3`

## Project Structure

```
smartflow-lead-engine/
├── data/                    # SQLite database (auto-created)
├── scripts/
│   └── seed.ts              # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/             # REST API routes
│   │   │   ├── leads/
│   │   │   ├── pipeline/
│   │   │   └── stats/
│   │   ├── leads/           # Lead management pages
│   │   ├── pipeline/        # CRM kanban board
│   │   ├── layout.tsx
│   │   └── page.tsx         # Dashboard
│   ├── components/
│   │   ├── layout/
│   │   ├── leads/
│   │   ├── pipeline/
│   │   └── ui/
│   └── lib/
│       ├── ai-analysis.ts   # Website AI analysis engine
│       ├── db.ts            # SQLite setup
│       ├── leads.ts         # Data access layer
│       ├── scoring.ts       # Lead scoring logic
│       ├── types.ts
│       └── utils.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Seed Sample Data (optional)

```bash
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List all leads |
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads/:id` | Get lead with analysis |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| POST | `/api/leads/:id/analyze` | Run AI website analysis |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/pipeline` | Pipeline grouped by status |

## Lead Scoring

Scores range from **0 to 100** based on:

- Website quality (20%)
- Mobile friendliness (15%)
- Page speed (15%)
- SEO basics (15%)
- Trust elements (15%)
- Missing contact form bonus (+5)
- Quick win opportunities (+2 each, max 15)
- Automation opportunities (+1 each, max 5)

Higher scores indicate stronger SmartFlow sales opportunities.

## CRM Pipeline Stages

1. **New Lead** — Just added, not yet analyzed
2. **Analyzed** — AI analysis complete
3. **Contacted** — Initial outreach sent
4. **Follow Up** — Awaiting response
5. **Proposal Sent** — SmartFlow proposal delivered
6. **Client** — Converted customer

---

Built for SmartFlow Suisse 🇨🇭
