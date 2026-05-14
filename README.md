# 🚀 TeamTasker | Modern Collaborative Project Management

TeamTasker is a premium, full-stack SaaS platform designed for agile teams to manage projects, track tasks, and collaborate in real-time. Built with a focus on speed, security, and a beautiful user experience.

![TeamTasker Dashboard](public/next.svg) <!-- Replace with a real screenshot if available -->

## ✨ Features

- **🔐 Robust Authentication**: Secure JWT-based signup and login flow with encrypted passwords.
- **📊 Real-time Dashboard**: Track project progress, task status distributions (To Do, In Progress, Completed), and overdue tasks at a glance.
- **📁 Project Management**: Create and manage multiple projects, each with its own dedicated workspace.
- **✅ Task Tracking**: Comprehensive task management with priority levels (Low, Medium, High), due dates, and assignees.
- **👥 Team Collaboration**: Invite team members to specific projects via email and assign tasks directly to them.
- **🎨 Premium UI/UX**: Fully responsive, dark-mode inspired design built with Tailwind CSS v4 and ShadCN UI.
- **📱 Mobile Ready**: Optimized for all screen sizes with a responsive sidebar and mobile drawer.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) (Base UI version)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satya-ctrl/Team-Tasker-SAAS.git
   cd Team-Tasker-SAAS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_postgresql_url"
   JWT_SECRET="your_random_secret_key"
   ```

4. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components and layout elements.
- `src/lib`: Utility functions and database/auth configurations.
- `src/store`: Global state management using Zustand.
- `prisma/`: Database schema and seed scripts.

## 🚢 Deployment (Railway)

This project is optimized for deployment on [Railway](https://railway.app/):

1. Connect your GitHub repository to a new Railway project.
2. Provision a **PostgreSQL** service.
3. In the Next.js service settings, add the following variables:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET`: A secure random string.
4. Railway will automatically run `npm run build` and `prisma generate` during deployment.

## 📄 License

This project is licensed under the MIT License.
