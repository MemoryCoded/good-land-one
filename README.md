# Proto-Digital Gallery Website

A self-hosted photo gallery website for recordsofdust.

## Features

- Masonry grid with variable-height photos
- Custom folder-style header
- Master archive model with per-collection archives
- Per-photo canvas frames with glowing watermarks
- Full-screen photo viewer
- Progressive image loading
- Admin panel with split-screen editor

## Stack

- Frontend: React + TypeScript + Tailwind + Vite
- Backend: FastAPI + SQLAlchemy + PostgreSQL + Redis
- Storage: Cloudflare R2
- Infrastructure: Hetzner VPS + Nginx + Cloudflare

## Setup

1. Copy `.env.example` to `.env`
2. Run `docker compose up -d`
3. Backend: `cd backend && uvicorn app.main:app --reload`
4. Frontend: `cd frontend && npm run dev`

## Status

In development.
