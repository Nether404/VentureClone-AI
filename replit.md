# Overview

VentureClone AI is a comprehensive business cloning platform that analyzes existing online businesses for clonability potential. The application helps entrepreneurs identify promising businesses to replicate by providing AI-powered analysis across multiple dimensions including technical complexity, market opportunity, competitive landscape, resource requirements, and time to market. Users can input URLs for analysis, receive detailed scoring and insights, and follow a structured 6-stage workflow from discovery through AI automation implementation.

## Recent Updates (January 2025)
- **Enhanced User Experience**: Loading states with skeleton loaders, shimmer animations
- **Advanced Search**: Filtering by score, business model, and sorting options
- **Data Management**: Export/import capabilities (JSON, CSV formats)
- **Mobile Optimization**: Responsive navigation and optimized layouts
- **Batch Processing**: Analyze up to 10 URLs simultaneously
- **Comparison Tools**: Side-by-side analysis comparison view
- **Performance**: Server-side pagination for large datasets
- **Analytics**: Advanced visualizations with Chart.js integration
- **Integration Ready**: Webhook endpoints and public API support

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server. The client follows a component-based architecture with:

- **UI Components**: Radix UI primitives with shadcn/ui styling for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting dark mode by default
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing with authentication-based route protection
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Authentication UI**: Landing page for unauthenticated users, dashboard with user profile and logout functionality

The frontend is structured with clear separation between pages, components, and utility functions, with path aliases for clean imports.

## Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

- **API Design**: RESTful API endpoints with consistent error handling and request/response patterns
- **Middleware**: Custom logging middleware for API request tracking and performance monitoring
- **Route Organization**: Modular route registration system with dedicated route handlers
- **Error Handling**: Centralized error handling with proper HTTP status codes and JSON responses

## Data Storage Solutions

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations

- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud hosting
- **Storage Interface**: Abstract storage interface with in-memory implementation for development and testing
- **Data Models**: Users, AI Providers, Business Analyses, and Workflow Stages with proper relationships

## Authentication and Authorization

**Authentication**: Replit Auth OpenID Connect integration for secure, seamless authentication

- **SSO Provider**: Uses Replit as the identity provider with OpenID Connect protocol
- **User Model**: Stores user profile from Replit including email, name, and profile image
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple for server-side session storage
- **Authorization**: User-scoped data access with consistent user ID validation from Replit sub claim
- **Session Storage**: Persistent sessions stored in database for reliability across server restarts
- **Token Refresh**: Automatic access token refresh using refresh tokens for continuous authentication

## External Service Integrations

**AI Provider Integration**: Multi-provider AI service architecture supporting:

- **OpenAI**: GPT models for business analysis and content generation
- **Google Gemini**: Alternative AI provider for diverse analysis perspectives  
- **Grok (X.AI)**: Additional AI provider option for comprehensive coverage
- **Provider Management**: User-configurable API keys with active provider selection
- **Abstraction Layer**: Unified AI service interface for consistent usage across providers

**Business Analysis Services**:
- **URL Analysis**: AI-powered website analysis for business model identification
- **Scoring System**: Multi-dimensional scoring across 5 key criteria
- **Content Generation**: AI-generated insights, risks, and opportunities
- **Workflow Automation**: Stage-based content generation for systematic business cloning

## Development and Build Tools

**Development Environment**: 
- **Vite**: Fast development server with HMR and optimized builds
- **TypeScript**: Strict type checking across frontend, backend, and shared code
- **ESM**: Modern ES modules throughout the application
- **Path Resolution**: Unified import aliases for clean code organization

**Production Build**:
- **Frontend**: Vite production build with optimized assets
- **Backend**: esbuild bundling for Node.js deployment
- **Static Serving**: Express serves built frontend assets in production
- **Environment Configuration**: Environment-based configuration for database and AI services