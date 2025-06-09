# MyApp - Work Order Management System

A Next.js application for managing work orders and financial records.

## Features

- User authentication with NextAuth.js
- Financial records management
- Work order tracking with status updates
- Modern UI with Tailwind CSS
- Form validation with Zod
- MySQL database with Prisma ORM

## Prerequisites

- Node.js 16.x or later
- MySQL 5.7 or later
- XAMPP (for local development)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd myapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
DATABASE_URL="mysql://root:@localhost:3306/myapp"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- NextAuth.js
- Prisma
- MySQL
- React Hook Form
- Zod

## License

MIT 