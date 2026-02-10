# Store Rating System

A full-stack store rating application with role-based access control. System Administrators can manage the platform, Normal Users can rate stores, and Store Owners can view their ratings.

## Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Zod Validation

**Frontend** (Coming Soon)
- React + Vite
- React Router
- Axios
- Tailwind CSS

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL database
- npm

### Installation

1. Clone and install dependencies
```bash
git clone <repository-url>
cd store-rating-system/backend
npm install
```

2. Create `.env` file in backend directory
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Setup database
```bash
npm run db:schema
```

4. Start server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

## API Endpoints

Base URL: `http://localhost:5000/api`

**Auth**
- POST `/auth/signup` - Register user
- POST `/auth/login` - Login
- POST `/auth/change-password` - Change password

**Admin** (requires ADMIN role)
- GET `/admin/dashboard` - Platform stats
- POST `/admin/users` - Create user
- GET `/admin/users` - List users
- GET `/admin/users/:id` - Get user
- POST `/admin/stores` - Create store
- GET `/admin/stores` - List stores

**Stores** (requires USER role)
- GET `/stores` - Browse stores
- POST `/stores/:id/rating` - Submit rating
- GET `/stores/:id/rating` - Get user's rating

**Owner** (requires OWNER role)
- GET `/owner/dashboard` - View store ratings

## Features

**Admin**
- Manage users and stores
- View platform statistics

**User**
- Browse and search stores
- Submit and update ratings (1-5 stars)
- Change password

**Owner**
- View store ratings
- See customer feedback

## Database Schema

- **Users**: Accounts with roles (ADMIN, USER, OWNER)
- **Stores**: Business entities with owners
- **Ratings**: User ratings for stores (1-5)

## Validation Rules

- Name: 20-60 characters
- Email: Valid format, unique
- Password: 8-16 chars, 1 uppercase, 1 special character
- Rating: Integer 1-5

## License

ISC
