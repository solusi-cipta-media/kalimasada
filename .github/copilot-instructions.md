# GitHub Copilot Instructions for Kalimasada

## Project Overview

This project is for manage Spa and Salon business.
This is a Next.js 14+ admin dashboard built with MUI v5, featuring role-based access control (RBAC), JWT authentication, and PostgreSQL database via Prisma ORM. Based on Vuexy template with custom authentication and permission system.

## Architecture Patterns

### Layout System

- Uses route groups: `(dashboard)` for authenticated pages, `(blank-layout-pages)` for auth/error pages
- Layout switching via `@layouts/LayoutWrapper.tsx` between vertical/horizontal layouts
- Core layout components in `@layouts/` with `@` prefix for internal modules
- Theme system with cookie persistence in `@core/contexts/settingsContext`
- Sidebar Menu : - Beranda (Main Dashboard) - Layanan (Services) - Jadwal (Schedule) - Gaji (Salary) - Karyawan (Employees) - Customer (Customers)
- For every submitting a form, show a loading indicator on the submit button and disable the button to prevent multiple submissions.
- Show a success message when the form is successfully submitted.
- Show an error message when the form submission fails.

### UI UX

- Create UI from the reference design in `.github/ui-ux/` folder
- Use MUI components and theming
- Responsive design for desktop and mobile

### Authentication Flow

- Middleware in `src/middleware.ts` handles JWT verification for all routes except `IGNORED_AUTH_PATH`
- JWT tokens stored in HTTP-only cookies with automatic refresh
- User context passed via headers (`userId`) to server components
- Auth endpoints in `src/app/api/auth/` (login/logout)

### Permission System

- Hierarchical permissions in `Permission` model with parent-child relationships
- Role-based access via `RolePermission` junction table
- Dynamic menu generation in `GenerateMenu.tsx` based on user permissions
- Permissions seeded from `prisma/data/Permission.seed.ts` with navigation structure

### Database Patterns

- Singleton Prisma client in `@libs/database.ts` with global instance caching
- Repository pattern: `UserLoggedInRepository`, `AccessRepository`, `RoleRepository`
- Use `"server-only"` directive for server-side database operations
- Migrations in `prisma/migrations/` with descriptive names
- Make the table and field names in English
- Make the database relation clear and easy to understand

## Development Workflow

- Make the UI user-friendly and responsive for both desktop and mobile
- Use `bun dev` for local development server
- Make sure check the error handling and validation for all forms and API routes
- Make the code clean and maintainable, following best practices

### Database Operations

```bash
# Development migrations
bunx prisma migrate dev --name descriptive_change_name

# Deploy migrations (production)
bunx prisma migrate deploy

# Reset database (development only)
bunx prisma migrate reset

# Seed data
bunx prisma db seed
# Or with mode: bun run prisma/seed.ts --mode dummy
```

### Build Process

- Icons bundled via `build:icons` script using `tsx src/assets/iconify-icons/bundle-icons-css.ts`
- Auto-runs on `postinstall`
- Uses Bun as primary package manager (`bun.lockb`)

### Key Conventions

- Server components use `"server-only"` directive
- API routes follow `/api/{resource}/{action}` pattern
- Error handling via `ResponseError` class and `responseError` helper
- Form validation with `react-hook-form` + `@hookform/resolvers`
- TypeScript paths: `@/` for `src/`, `@core/`, `@layouts/`, `@menu/`, `@libs/`

## File Organization

- `src/@core/`: Core utilities, hooks, components, JWT handling
- `src/@layouts/`: Layout components and utilities
- `src/@menu/`: Menu components for vertical/horizontal navigation
- `src/@libs/`: Database connection and shared libraries
- `src/repositories/`: Data access layer with business logic
- `src/client/`: Axios instances and client-side API helpers
- `src/types/`: Shared TypeScript type definitions

## Testing & Development

- Default login: `admin@email.com` / `12345` (from seeder)
- Dev server: `bun dev` on `http://localhost:3000`
- Environment variables in `.env` (copy from `.env.example`)

## Common Patterns

- Use `throwIfMissing()` for server-side validation
- Access user data via `UserLoggedInRepository` in server components
- Dynamic menu generation based on permissions with `showOnSidebar` flag
- Cookie-based settings with `getCookieName()` utility for multi-tenant support
