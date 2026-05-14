# Team Task Manager

A powerful, collaborative task and project management platform built for modern teams.

## Features

- **Authentication System:** Secure JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC):** Admin and Member roles with specific permissions.
- **Project Management:** Create, edit, and manage projects. Invite team members.
- **Task Management:** Create, assign, and track tasks across projects with statuses and priorities.
- **Analytics Dashboard:** Visual overview of team productivity using Recharts.
- **Modern UI:** Built with Tailwind CSS, ShadCN UI, and Framer Motion for a premium feel.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI, Zustand, React Query
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL, Prisma ORM
- **Deployment:** Vercel (Frontend & API), Railway (Database)

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/teamtasker?schema=public"
   JWT_SECRET="your-super-secret-key-change-me"
   ```

4. **Database Setup:**
   Make sure you have a PostgreSQL database running. Then run:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
   *(Note: The seed script creates an initial admin user: admin@example.com / admin123)*

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## Deployment Steps (Railway + Vercel)

1. **Database on Railway:**
   - Go to [Railway](https://railway.app/) and create a new project.
   - Add a "PostgreSQL" plugin.
   - Copy the provided `DATABASE_URL`.

2. **Application on Vercel:**
   - Push your code to GitHub.
   - Go to [Vercel](https://vercel.com/) and import your repository.
   - Add the following Environment Variables in Vercel settings:
     - `DATABASE_URL` (from Railway)
     - `JWT_SECRET` (generate a random strong string)
   - In the "Build & Development Settings", the default Next.js build command (`npm run build`) is fine. Ensure Prisma generates the client during build (you can add a `postinstall` script in `package.json`: `"postinstall": "prisma generate"`).
   - Deploy!

## API Endpoints

- **Auth:**
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`

- **Projects:**
  - `GET /api/projects`
  - `POST /api/projects`
  - `PUT /api/projects/:id`
  - `DELETE /api/projects/:id`

- **Tasks:**
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks/:id`
  - `DELETE /api/tasks/:id`
