# Team Tenacious Field Trainer Progress Hub

## Overview

This is a full-stack web application built for Team Tenacious to track and manage field representative training progress. The application provides role-based dashboards for trainers and administrators to monitor rep progress through a 13-step certification process, with integrated SMS notifications and milestone tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Custom React Context (useAppState hook) with useReducer
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling
- **API Structure**: RESTful API with `/api` prefix routing

### Database & ORM
- **Database**: PostgreSQL (configured via Neon Database)
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared between client and server via `shared/schema.ts`

## Key Components

### Authentication System
- **Provider**: Google Sign-In integration (placeholder implementation)
- **Session Management**: In-memory storage with role-based access control
- **Roles**: Trainer and Admin with different permission levels

### Data Models
- **Users**: Basic authentication and profile information
- **Reps**: Field representatives with progress tracking
- **Field Trainers**: Trainers managing assigned reps
- **Audit Logs**: Activity tracking and compliance logging

### Progress Tracking System
- **13-Step Certification Process**: Structured progression through training stages
- **Milestone System**: JSON-based subtask tracking within each step
- **Stage Categorization**: Onboarding, Field Training, Advanced Training, Independence Path

### External Integrations
- **SMS Notifications**: EZTexting integration via Zapier webhooks (placeholder)
- **Milestone Triggers**: Automated notifications for progress milestones
- **Welcome Messages**: Automated onboarding communications

## Data Flow

1. **Authentication Flow**: User signs in → Role selection → Dashboard redirect
2. **Rep Management**: Add reps → Assign to trainers → Track progress
3. **Progress Updates**: Trainers mark milestones → Triggers SMS notifications → Updates dashboard analytics
4. **Admin Oversight**: Full system visibility with analytics and funnel tracking

## External Dependencies

### Production Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-zod for validation
- **State Management**: @tanstack/react-query for server state
- **Styling**: Tailwind CSS with class-variance-authority
- **Forms**: react-hook-form with @hookform/resolvers
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild, tsx for development workflow
- **TypeScript**: Full TypeScript support across the stack
- **Replit Integration**: Custom plugins for Replit environment

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Port Configuration**: Local port 5000, external port 80
- **Development Server**: Concurrent client (Vite) and server (tsx) processes
- **Hot Reload**: Vite HMR for client, tsx watch mode for server

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Deployment Target**: Autoscale deployment on Replit
- **Asset Serving**: Express serves static assets in production

### Environment Configuration
- **Database**: Environment variable `DATABASE_URL` for PostgreSQL connection
- **Session Storage**: In-memory storage (development), scalable storage needed for production
- **External APIs**: Environment variables for Zapier webhooks and EZTexting API keys

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```