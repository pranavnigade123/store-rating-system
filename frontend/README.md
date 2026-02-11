# Store Rating System - Frontend

React + TypeScript frontend for the Store Rating System with role-based dashboards.

## Tech Stack

- React 18 with TypeScript
- Vite (build tool)
- React Router (navigation)
- Axios (API calls)
- Tailwind CSS (styling)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

Frontend runs at: http://localhost:5173

## Features

### Authentication
- Login/Signup pages
- JWT token management
- Auto-redirect based on user role
- Protected routes

### Admin Dashboard
- View platform statistics (users, stores, ratings)
- Manage users (create, view, filter by role)
- Manage stores (create, view, search)
- Sortable tables with pagination

### User Dashboard
- Browse all stores
- Search stores by name/address
- Submit ratings (1-5 stars)
- Update existing ratings
- Real-time rating updates

### Owner Dashboard
- View store information
- See average rating
- List of customer reviews

### Common Features
- Change password (for Users and Owners)
- Responsive design
- Loading states
- Error handling
- Toast notifications

## Project Structure

```
src/
├── api/
│   └── client.ts          # Axios setup with interceptors
├── components/
│   └── common/            # Reusable components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Table.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── Toast.tsx
│       ├── Layout.tsx
│       ├── Navbar.tsx
│       └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx    # Auth state management
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminUsers.tsx
│   ├── AdminStores.tsx
│   ├── UserStores.tsx
│   ├── OwnerDashboard.tsx
│   └── ChangePassword.tsx
└── App.tsx                # Routes configuration
```

## Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

## Notes

- Backend must be running on port 5000
- All API calls include JWT token automatically
- 401 errors trigger automatic logout
- Search has 500ms debounce to reduce API calls
