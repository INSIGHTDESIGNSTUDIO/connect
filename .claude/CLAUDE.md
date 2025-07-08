# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev`: Start development server (Next.js)
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint for code linting
- `npm run typecheck`: Run TypeScript compiler check without emitting files
- `npm run init-db`: Initialize SQLite database with tables and default admin user

## Project Architecture

This is a Next.js application that helps educational staff find resources based on their role and needs. The application uses SQLite for data storage and includes an admin dashboard for content management.

### Tech Stack
- **Frontend**: React 18, TypeScript, Next.js 14
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React

### Database Architecture
The application uses SQLite with four main tables:
- `resources`: Educational resources with role/need associations
- `roles`: User roles (HE Lecturer, VET/TAFE Lecturer, etc.)
- `needs`: User needs (Teaching Resources, Unit Development, etc.)
- `users`: Admin users for dashboard access

All associations are stored as JSON strings in the database for flexibility.

### Core Components
- **Resource Flow**: Role selection → Needs selection → Resource listing
- **Admin Dashboard**: Full CRUD operations for resources, roles, needs, and users
- **Database Layer**: `src/lib/db.ts` handles connection, `src/lib/sqlite.ts` provides CRUD operations
- **Authentication**: NextAuth.js with bcrypt password hashing

### Admin Access
- Default admin: `admin@example.com` / `password123`
- Admin routes are protected at `/admin/*`
- Admin user creation via `scripts/reset-admin-password.js`

## Development Setup
1. Run `npm install` to install dependencies
2. Run `npm run init-db` to initialize the database
3. Run `npm run dev` to start development server
4. Access admin at `http://localhost:3000/admin`

## Code Style Guidelines
- **Imports**: Group third-party imports first, then local imports using @/ alias for src directory
- **Components**: Use functional components with forwardRef, explicit interfaces for props
- **Naming**: PascalCase for components/types, camelCase for variables/functions, kebab-case for CSS classes
- **TypeScript**: Strict typing enabled, use explicit interfaces, union types for limited options
- **Error Handling**: Use optional chaining (?.), nullish coalescing (??), provide fallback values
- **Formatting**: Use Tailwind utilities with cn() helper for class merging, consistent indentation
- **React Patterns**: Use forwardRef for UI components, destructure props, use displayName
- **State Management**: Use React Context for shared state
- **Database**: Always use server-side functions for database operations, never on client side

## Project Structure
- `/src/components`: UI components (common UI in /ui subdirectory, admin components in /admin)
- `/src/lib`: Database utilities, context providers, and services
- `/src/pages`: Next.js page components and API routes (/api for endpoints, /admin for admin pages)
- `/src/types`: TypeScript type definitions
- `/src/styles`: Global styles and Tailwind configuration
- `/scripts`: Database initialization and utility scripts
- `/data`: SQLite database files (git-ignored)
- `/backups`: Database backups (git-ignored)