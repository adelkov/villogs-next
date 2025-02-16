# Baby Activity Tracker

A modern web application for tracking baby activities like feeding, sleeping, and diaper changes in real-time.

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - For type-safe code
- **Tailwind CSS** - For styling

### Backend
- **Next.js Server Components** - For server-side rendering
- **Server Actions** - For handling mutations
- **MySQL** - Database
- **Prisma** - ORM and database migrations
- **Auth.js (NextAuth)** - Authentication

## Key Features

### Authentication
- Email/password authentication
- Protected routes and API endpoints
- Secure session management
- Type-safe authentication with Auth.js

### Activity Tracking
- **Feeding Logs**
  - Track breastfeeding sessions
  - Left/right side tracking
  - Start and end times
  - Duration tracking

- **Sleep Logs**
  - Track sleep periods
  - Real-time duration display
  - Sleep history

- **Diaper Changes**
  - Track diaper changes
  - Multiple types (pee/poop/both/empty)
  - Timestamped entries

### Real-time Features
- Live duration tracking for active sessions
- Immediate UI updates
- Optimistic updates for better UX

### Data Management
- Create, read, update, and delete activities
- Automatic data revalidation
- Type-safe database operations with Prisma

### User Interface
- Responsive design
- Dark theme
- Mobile-friendly
- Real-time updates
- Loading states
- Error handling

## Architecture Highlights

### Type Safety
- Full TypeScript implementation
- Prisma-generated types
- Type-safe API routes and server actions

### Security
- Authentication middleware
- Protected server actions
- Secure session handling
- CSRF protection

### Performance
- Server components for better performance
- Optimized data fetching
- Efficient real-time updates

### Code Organization
- Feature-based folder structure
- Reusable components
- Shared utilities
- Type-safe database access

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```env
   DATABASE_URL="mysql://..."
   AUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `npm run dev`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint


