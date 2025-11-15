# Smart Food Connect

A web platform connecting food donors (retailers, restaurants) with charities and individuals to reduce food waste and address food insecurity.

## Overview

Smart Food Connect enables restaurants and retailers to donate surplus food items to charities and individuals in need. The platform features real-time inventory management, location-based browsing, and an admin dashboard for managing users, orders, and generating reports.

## Features

### For Donors (Retailers/Restaurants)
- Post surplus food items with details (name, quantity, expiration date, location)
- Manage inventory with real-time updates
- Track donation history and impact

### For Recipients (Charities/Individuals)
- Browse available food items by location
- Add items to cart and place orders
- Receive notifications for new items
- View order history

### For Administrators
- User management (activate/deactivate accounts)
- Order monitoring and management
- Analytics and reporting dashboard
- Location-based insights with map visualization

## Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.7 (build tool and dev server)
- Tailwind CSS 3.4.18 (styling)
- Lucide React (icons)
- Google Maps API integration (@vis.gl/react-google-maps)
- Axios (API requests)

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.19.2
- Nodemailer (email notifications)
- Multer (file uploads)
- CORS enabled

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB database
- Google Maps API key (for location features)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yaminibuyya27/smart-food-connect.git
cd smart-food-connect
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=3001
NODE_ENV=development

# Email (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Running the Application

### Development Mode

**Frontend:**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173` (Vite default)

**Backend:**
```bash
npm run server
```
The backend API will run on `http://localhost:3001` with nodemon for auto-restart on file changes.

**Run both simultaneously:**
Open two terminal windows and run the frontend and backend commands separately.

### Production Mode

**Build the frontend:**
```bash
npm run build
```

**Preview the production build:**
```bash
npm start
```

**Run backend in production:**
```bash
npm run server:prod
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Deployment

This project is configured for deployment on Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

The `vercel.json` configuration handles both frontend (static build) and backend (serverless functions).

## User Roles

- **Admin**: Manage users, view reports, monitor orders
- **Retailer/Restaurant**: Post and manage food inventory
- **Charity**: Browse and order food items for distribution
- **Individual**: Browse and order food items