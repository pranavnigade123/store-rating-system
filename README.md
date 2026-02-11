# Store Rating System

A web app where users can browse and rate stores. Built as part of a coding challenge to demonstrate full-stack development skills.

🔗 **Live Demo**: [https://store-rating-app-roxiler-system-apgrd2gcg8byctf9.southindia-01.azurewebsites.net](https://store-rating-app-roxiler-system-apgrd2gcg8byctf9.southindia-01.azurewebsites.net)

## Quick Start

Try it out with these demo accounts:
- **Admin**: admin@storerating.com / Demo@123
- **User**: pranav.nigade@gmail.com / Demo@123  
- **Owner**: pranav.nigade@business.com / Demo@123

## What It Does

Three types of users, each with their own dashboard:

**Admin** - Manages the platform
- Create users and stores
- View stats (total users, stores, ratings)
- Filter and search through data

**User** - Rates stores
- Browse all stores
- Search by name or location
- Submit ratings (1-5 stars)
- Update their ratings anytime

**Owner** - Tracks their store performance
- See all customer reviews
- View average rating
- Monitor feedback

## Tech Stack

- **Backend**: Node.js + Express.js + PostgreSQL (Supabase)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Auth**: JWT tokens
- **Deployment**: Docker + Azure App Service

## Local Setup

### Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Setup database:
```bash
npm run db:schema
npm run db:seed
```

Start server:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be running at http://localhost:5173

## Features

- Clean, modern UI with orange/slate color scheme
- Role-based access control
- Real-time rating updates
- Search and filter functionality
- Responsive design
- Form validations (name 20-60 chars, password 8-16 chars with uppercase + special char)

## Database

Three main tables:
- **users** - Accounts with roles (ADMIN, USER, OWNER)
- **stores** - Business listings linked to owners
- **ratings** - User ratings for stores (1-5 scale)

## Project Structure

```
backend/
  src/
    routes/      # API endpoints
    services/    # Business logic
    middleware/  # Auth & authorization
    db/          # Database setup
    
frontend/
  src/
    pages/       # Main views
    components/  # Reusable UI components
    context/     # Auth state management
```

## Notes

- Backend uses JavaScript for simplicity
- Frontend uses TypeScript for better type safety
- Deployed as a single Docker container
- Database hosted on Supabase
