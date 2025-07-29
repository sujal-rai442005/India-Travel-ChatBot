# India Travel Guide - Replit.md

## Overview

This is a full-stack travel chatbot application focused on helping users discover travel destinations across India. The application features a modern chat interface built with React and TypeScript, powered by an Express.js backend with PostgreSQL database integration. Users can interact with an AI-powered travel assistant that provides personalized recommendations for Indian destinations based on their queries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **State Management**: TanStack React Query for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Component Design**: Modern component-based architecture with reusable UI components

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API development
- **Runtime**: Node.js with ES modules support
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage implementation with interface for easy database integration
- **Session Management**: Built-in session handling for chat persistence

### Key Technology Decisions

**Frontend Framework Choice**: React with TypeScript was chosen for its robust ecosystem, type safety, and excellent developer experience. Vite provides fast development builds and hot module replacement.

**Component Library**: shadcn/ui was selected over alternatives like Material-UI or Ant Design because it provides unstyled, accessible components that can be fully customized with Tailwind CSS while maintaining consistency.

**State Management**: TanStack React Query was chosen over Redux or Zustand because the application primarily deals with server state (API responses) rather than complex client state management.

**Styling Strategy**: Tailwind CSS with CSS variables provides a scalable design system with consistent theming and easy customization.

## Key Components

### Chat Interface
- **ChatHeader**: Displays app branding with travel-themed styling
- **ChatMessages**: Renders conversation history with bot and user messages
- **ChatInput**: Handles user input with location suggestions and quick actions
- **RecommendationCard**: Displays travel destination recommendations with images and details

### Data Models
- **Destinations**: Travel locations with metadata (category, description, best time to visit, local food, travel tips)
- **Chat Messages**: Conversation history with support for bot responses and recommendations
- **Recommendations**: Structured travel suggestions returned by the chat system

### API Endpoints
- `GET /api/destinations/search`: Search destinations by query string
- `GET /api/destinations/popular`: Retrieve popular destination suggestions
- `POST /api/chat`: Process user messages and return AI-generated responses with recommendations

## Data Flow

1. **User Input**: User types a travel query or selects a quick action
2. **API Request**: Frontend sends message to `/api/chat` endpoint
3. **Processing**: Backend processes the query and searches relevant destinations
4. **Response Generation**: System generates contextual travel recommendations
5. **UI Update**: Frontend displays the response with destination cards and travel information
6. **State Management**: React Query caches responses for improved performance

## External Dependencies

### Production Dependencies
- **Database**: Neon Database (PostgreSQL) for cloud-hosted data storage
- **UI Components**: Radix UI primitives for accessible component foundations
- **Form Handling**: React Hook Form with Zod for validation
- **Date Utilities**: date-fns for date formatting and manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Replit Integration**: Custom Vite plugin for Replit development environment
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Type Safety**: TypeScript with strict configuration for compile-time safety

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild bundles Express server with external package references
- **Database**: Drizzle migrations ensure schema consistency across environments

### Environment Configuration
- **Development**: Local development with file watching and hot reload
- **Production**: Node.js server serving built frontend and API endpoints
- **Database**: Environment variable configuration for flexible database connections

### Hosting Considerations
The application is designed for Replit deployment with:
- Single-command startup (`npm run dev` for development, `npm start` for production)
- Environment variable support for database configuration
- Integrated development tools and error overlay for debugging

The architecture supports easy scaling by implementing the storage interface with a full database backend and adding caching layers as needed.

## Recent Changes: Latest modifications with dates

### July 29, 2025 - Complete India Coverage Implemented
- **Comprehensive destination database**: Added 70+ destinations covering ALL Indian states and union territories
- **Complete UP coverage**: Added all major UP cities (Lucknow, Agra, Varanasi, Kanpur, Meerut, Allahabad, Mathura, Vrindavan) with state-level recommendations
- **Fixed Jharkhand recognition**: Added state-level destinations for Jharkhand including Netarhat, Betla National Park, and tribal heritage sites
- **Enhanced location extraction**: Priority-based recognition system for immediate state/city identification
- **All regions now covered**: 
  - Northeast India: All 8 states with capital cities and attractions
  - North India: Complete Kashmir, Ladakh, Himachal, Uttarakhand coverage  
  - Central India: Full Madhya Pradesh, Chhattisgarh, Jharkhand coverage
  - East India: West Bengal, Odisha, Bihar with key destinations
  - UP: All major cities and spiritual circuits (Krishna Janmabhoomi, Ganga Aarti)
- **Improved mobile responsiveness**: Cross-device compatibility tested and optimized
- **Clean codebase**: All TypeScript errors resolved, application fully functional