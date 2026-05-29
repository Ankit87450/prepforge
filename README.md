# PrepForge

A mock technical-interview app I built to practice for SWE interviews. You pick a role and difficulty, it generates questions, you answer them, and it gives you a score plus feedback on each answer. Everything gets saved so you can see how you're improving over time.

I made this because I was tired of bouncing between random question lists and never getting feedback on whether my answers were actually good. The AI does that part.

Built with React on the front end and Django on the back.

## What it does

- Sign up, pick your target role (Frontend / Backend / Full Stack / SWE / DSA) and a difficulty
- Questions are generated based on the role — DSA, system design, DBMS, React, Django, etc.
- Type your answer, get a score out of 10 with what you did well and what to fix
- A dashboard tracks your past sessions and average score

There's also an ideal-answer toggle on each question if you want to compare.

## Tech stack

**Frontend** — React (Vite), React Router, Zustand for state, Axios, Recharts for the charts

**Backend** — Django, Django REST Framework, SimpleJWT for auth

**Database** — SQLite for local dev, Postgres for production

**AI** — OpenAI API for generating questions and grading answers

## Running it locally

You'll need Python 3.10+ and Node 18+.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Windows: copy .env.example .env
python manage.py migrate
python manage.py runserver
```

Backend runs on `http://localhost:8000`.

> Note: `.env.example` points at Postgres by default. If you don't have Postgres installed, just set `DATABASE_URL=sqlite:///db.sqlite3` in your `.env` and it'll use SQLite instead — no setup needed.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env            # Windows: copy .env.example .env
npm run dev
```

Open `http://localhost:5173` and you're in.

### About the OpenAI key

The app works without an API key. If you don't add one, it falls back to a built-in question bank and scores answers by keyword matching — good enough to click through the whole flow. To get real AI-generated questions and proper feedback, drop your key into `OPENAI_API_KEY` in `backend/.env`.

## How it's structured# PrepForge

A mock technical-interview app I built to practice for SWE interviews. You pick a role and difficulty, it generates questions, you answer them, and it gives you a score plus feedback on each answer. Everything gets saved so you can see how you're improving over time.

I made this because I was tired of bouncing between random question lists and never getting feedback on whether my answers were actually good. The AI does that part.

Built with React on the front end and Django on the back.

## What it does

- Sign up, pick your target role (Frontend / Backend / Full Stack / SWE / DSA) and a difficulty
- Questions are generated based on the role — DSA, system design, DBMS, React, Django, etc.
- Type your answer, get a score out of 10 with what you did well and what to fix
- A dashboard tracks your past sessions and average score

There's also an ideal-answer toggle on each question if you want to compare.

## Tech stack

**Frontend** — React (Vite), React Router, Zustand for state, Axios, Recharts for the charts

**Backend** — Django, Django REST Framework, SimpleJWT for auth

**Database** — SQLite for local dev, Postgres for production

**AI** — OpenAI API for generating questions and grading answers

## Running it locally

You'll need Python 3.10+ and Node 18+.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Windows: copy .env.example .env
python manage.py migrate
python manage.py runserver
```

Backend runs on `http://localhost:8000`.

> Note: `.env.example` points at Postgres by default. If you don't have Postgres installed, just set `DATABASE_URL=sqlite:///db.sqlite3` in your `.env` and it'll use SQLite instead — no setup needed.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env            # Windows: copy .env.example .env
npm run dev
```

Open `http://localhost:5173` and you're in.

### About the OpenAI key

The app works without an API key. If you don't add one, it falls back to a built-in question bank and scores answers by keyword matching — good enough to click through the whole flow. To get real AI-generated questions and proper feedback, drop your key into `OPENAI_API_KEY` in `backend/.env`.

## How it's structured