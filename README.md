# 🔔 Ping 'n Pay

*Send the invoice. Ping the client. Get paid.*

Ping 'n Pay is a full-stack invoicing system with a not-so-secret superpower: it **won't let overdue invoices go quietly into the night**. Create clients, raise invoices, and let the notification engine chase payments over email, SMS, WhatsApp and in-app alerts — so you don't have to.

---

## ✨ What it does

- 🔐 **Auth & orgs** — JWT login, role-aware access, everything scoped to your organisation
- 👥 **Client management** — a proper address book for the people who owe you money
- 🧾 **Invoicing** — line items, tax, statuses, the works — full CRUD from draft to paid
- 📣 **Multi-channel nudges** — email, SMS, WhatsApp and a live in-app bell, all rule-driven
- ⏰ **Overdue detection** — a scheduler that quietly checks due dates so you don't have to
- 💳 **Payments** — Stripe checkout + webhooks, or just log a payment manually
- 📊 **Dashboard** — outstanding, overdue and paid, at a glance

---

## 🧱 Tech stack

| | |
|---|---|
| **Backend** | Java 21 · Spring Boot 3 · Spring Security · Spring Data JPA · Flyway · Quartz · PostgreSQL |
| **Realtime & jobs** | Spring WebSocket (STOMP) for the live notification bell, Quartz for scheduled overdue sweeps |
| **Integrations** | Twilio (SMS & WhatsApp) · SendGrid (email) · Stripe (checkout + webhooks) |
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS · TanStack Query · React Hook Form + Zod |
| **Infra** | Docker Compose (Postgres + Redis) · GitHub Actions CI |

---

## 📜 How this thing got built

The commit history basically doubles as the changelog. Here's the story, one milestone at a time:

| Date | Milestone |
|---|---|
| 2026-07-16 | 🏗️ **Scaffolding day** — Spring Boot bootstrapped, Docker Compose stack, CI pipeline wired up before a single feature existed |
| 2026-07-17 | 🔑 **Auth arrives** — JWT login/register, users, roles, and the organisation model everything else hangs off |
| 2026-07-19 | 👤 **Clients** — CRUD for the people (and businesses) who'll be receiving invoices |
| 2026-07-21 | 🧾 **Invoicing** — the core domain: invoices, line items, status transitions |
| 2026-07-24 | 📡 **The notification engine** — multi-channel rules, Quartz overdue detection, and a WebSocket endpoint for live push. This is the whole point of the app |
| 2026-07-27 | 🎨 **Frontend scaffolding** — Vite + Tailwind + React, auth context, protected routes, the app shell |
| 2026-07-29 | 👥 **Client UI** — the backend client CRUD gets a face |
| 2026-07-31 | 📊 **Invoicing UI & dashboard** — list, detail, create pages, plus the outstanding/overdue/paid summary |
| 2026-08-03 | 🧩 **Notification data layer** — API client, types and hooks laid down ahead of the UI that would consume them |
| 2026-08-07 | 💳 **Stripe payments (backend)** — checkout sessions, webhook handling, manual payments, balance tracking |
| 2026-08-10 | 💸 **Payments UI** — record-payment modal, Stripe redirect, payment history |
| 2026-08-13 | 🔔 **Live notification center** — the bell finally rings: STOMP-backed inbox and notification-rule management, fully wired into the app |

Want the play-by-play? `git log --oneline --reverse` tells the same story with receipts.

---

## 🚀 Running it locally

### 1. Fire up the datastores

```bash
docker compose up -d
```

This gives you Postgres on `5432` and Redis on `6379`, both with sane local defaults (`pingnpay` / `pingnpay`).

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Flyway migrations run automatically on boot. The API comes up on **`http://localhost:8080/api`**.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on **`http://localhost:5173`** and proxies `/api` straight through to the backend — no CORS headaches in dev.

### Optional environment variables

The backend runs out of the box against local Postgres with no external services configured. To actually send email/SMS/WhatsApp or take payments, set:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signing key for auth tokens (has a dev default — **change it for anything real**) |
| `MAIL_HOST` / `MAIL_USERNAME` / `MAIL_PASSWORD` | SendGrid (or any SMTP) credentials for email reminders |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` / `TWILIO_WHATSAPP_FROM` | SMS + WhatsApp delivery |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Payment links and webhook verification |
| `CORS_ORIGINS` | Allowed frontend origin(s) in non-local setups |

See [`backend/src/main/resources/application.yml`](backend/src/main/resources/application.yml) for the full list and defaults.

---

## 📁 Project layout

```
backend/     Spring Boot API — domain, services, controllers, Flyway migrations
frontend/    React + Vite SPA — pages, components, API client, hooks
docker-compose.yml   Local Postgres + Redis
PROJECT_PLAN.md      The original blueprint (features, phases, architecture)
```

---

## 🗺️ What's next

Straight from the original plan — not built yet, but on the radar:

- Client self-serve portal
- Invoice PDF generation
- Recurring invoice schedules
- Aging reports & CSV/PDF export
- MFA
- Multi-currency support

---

*Built phase by phase, commit by commit — auth first, money last (on purpose).*
