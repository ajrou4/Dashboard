# Internship Dashboard

A modern, full-stack dashboard application built with Next.js 16, featuring user authentication and daily usage limits for contact viewing.

## 🚀 Live Demo

**Deployed Application:** [https://dashboard-rouge-theta.vercel.app/](https://dashboard-rouge-theta.vercel.app/)

## 📋 Features

### Core Functionality
- ✅ **User Authentication** - Secure authentication powered by Clerk
- ✅ **Agencies Database** - View all government agencies with unlimited access
- ✅ **Contacts Database** - Access employee contact information with daily limits
- ✅ **Daily Usage Tracking** - Users limited to viewing 50 contacts per day
- ✅ **Upgrade Prompt** - Premium plan modal when daily limit is reached
- ✅ **Responsive Design** - Mobile-friendly interface with modern UI

### Technical Features
- Server-side rendering with Next.js 16 App Router
- PostgreSQL database with Prisma ORM
- Server Actions for secure data fetching
- Real-time usage tracking per user
- Automatic daily limit reset at midnight

## 🏗️ System Architecture

![System Architecture](./system_architecture_diagram.png)

### Architecture Overview

1. **Frontend Layer (Next.js 16)**
   - Home page with navigation cards
   - Agencies page (unlimited viewing)
   - Contacts page (50 per day limit)

2. **Authentication Layer (Clerk)**
   - Secure user authentication
   - Protected routes via middleware
   - User session management

3. **Server Actions**
   - `getAgencies()` - Fetch all agencies
   - `getContacts()` - Fetch contacts with limit checking
   - `getUserUsage()` - Track daily usage per user

4. **Database Layer (PostgreSQL)**
   - **Agency** - Stores agency information
   - **Contact** - Stores employee contacts
   - **UserUsage** - Tracks daily contact views per user

5. **Deployment (Vercel)**
   - Automatic deployments from GitHub
   - Serverless functions
   - Edge network for fast global access

## 🛠️ Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Authentication:** Clerk
- **Database:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Version Control:** GitHub

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Vercel Postgres)
- Clerk account for authentication

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajrou4/Dashboard.git
   cd internship-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/dashboard"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Agency Model
```prisma
model Agency {
  id          String    @id @default(uuid())
  name        String
  state       String
  city        String?   
  website     String?
  contacts    Contact[]
  createdAt   DateTime  @default(now())
}
```

### Contact Model
```prisma
model Contact {
  id          String   @id @default(uuid())
  firstName   String?
  lastName    String?
  email       String
  phone       String?
  agencyId    String
  agency      Agency   @relation(fields: [agencyId], references: [id])
  createdAt   DateTime @default(now())
}
```

### UserUsage Model
```prisma
model UserUsage {
  id        String   @id @default(uuid())
  userId    String   // Clerk User ID
  date      String   // Format: YYYY-MM-DD
  count     Int      @default(0)
  
  @@unique([userId, date])
}
```

## 🔒 Authentication Flow

1. User visits the application
2. Middleware checks authentication status
3. Unauthenticated users are redirected to sign-in
4. Authenticated users can access protected routes
5. User ID is used to track daily contact views

## 📈 Usage Tracking System

### How It Works

1. **First Contact View**
   - System creates a `UserUsage` record for today
   - Increments count for each contact viewed
   
2. **Subsequent Views**
   - Checks existing usage for today
   - Calculates remaining views (50 - current count)
   - Fetches only the remaining number of contacts
   
3. **Limit Reached**
   - Returns empty contact list
   - Shows upgrade modal
   - Displays "limit reached" message

4. **Daily Reset**
   - New date creates new `UserUsage` record
   - Count resets to 0 automatically

## 🎨 UI/UX Features

- **Loading States** - Spinner animations during data fetching
- **Usage Counter** - Real-time display of daily limit progress
- **Upgrade Modal** - Premium plan promotion when limit reached
- **Responsive Tables** - Mobile-friendly data display
- **Navigation Bar** - Easy access to all pages
- **Hover Effects** - Interactive table rows

## 🚀 Deployment

This application is deployed on Vercel with automatic deployments from the main branch.

### Deploy Your Own

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📝 Assignment Requirements Checklist

- ✅ User authentication (Clerk)
- ✅ View all agencies (unlimited)
- ✅ View contacts with 50/day limit
- ✅ Upgrade prompt when limit exceeded
- ✅ Separate table pages for agencies and contacts
- ✅ Next.js 16 framework
- ✅ Deployed to Vercel
- ✅ GitHub repository
- ✅ System design diagram

## 👨‍💻 Developer

**Mohamed Ajrou**

- GitHub: [@ajrou4](https://github.com/ajrou4)
- Project: [Dashboard](https://github.com/ajrou4/Dashboard)

## 📄 License

This project was created as part of an internship application assignment.

---

**Note:** This application uses randomized data for demonstration purposes. The agencies and contacts data may not match real-world information.
