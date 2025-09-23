# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React with Vite)
- `npm run dev` - Start development server
- `npm run build` - Build for production 
- `npm run tsc-check` - Run TypeScript type checking

### Backend (Laravel)
- `php artisan serve` - Start Laravel development server
- `composer install` - Install PHP dependencies
- `php artisan migrate` - Run database migrations
- `php artisan test` - Run tests using Pest
- `vendor/bin/pint` - Format PHP code using Laravel Pint

## Architecture Overview

This is a Laravel + React (Inertia.js) full-stack application for KSEB (Kerala State Electricity Board) analytics.

### Tech Stack
- **Backend**: Laravel 11 with Inertia.js
- **Frontend**: React 18 with TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Maps**: Leaflet with react-leaflet
- **Data**: Laravel Data (Spatie) for DTOs
- **Testing**: Pest (PHP), ESLint + Prettier (JS/TS)

### Project Structure

#### Backend (Laravel)
- Use feature-based organization within Laravel's default directories
- Group related files by feature in subfolders (e.g., `app/Controllers/User/`, `app/Models/User/`)
- Use Laravel Data (Spatie) for DTOs with PHP attribute annotations for validation
- Services layer for business logic in `app/Services/`
- Models organized by feature in `app/Models/`

#### Frontend (React)
Located in `resources/js/` with these key directories:
- `Components/` - Reusable React components
- `Pages/` - Inertia.js page components
- `Layouts/` - Layout components
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `ui/` - shadcn/ui components
- `lib/` - Utility libraries
- `interfaces/` - TypeScript interfaces

### Key Conventions

#### Laravel
- Use Laravel Data for complex DTOs with validation attributes
- Follow feature-based grouping within standard Laravel directories
- Use Pest for testing
- Laravel Pint for code formatting

#### React/TypeScript
- Use object destructuring for props
- Treat props as immutable/readonly
- PascalCase for components and pages
- camelCase for hooks and utility functions
- Follow shadcn/ui patterns for UI components

### Dependencies
- **Excel Export**: `maatwebsite/excel`
- **WebSocket**: `textalk/websocket`
- **Route Management**: `tightenco/ziggy`
- **State Management**: Inertia.js handles client-server state
- **Date Handling**: `dayjs`
- **Icons**: `lucide-react`, `react-icons`

### Validation & Security
- Always validate request data using Laravel Data DTOs or Laravel's built-in validation
- Use PHP attribute annotations for validation rules in DTOs
- Never use request data without validation
- Use Laravel Sanctum for API authentication