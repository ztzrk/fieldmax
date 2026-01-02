# FieldMax 🏟️

FieldMax is a comprehensive web-based platform designed to streamline the process of booking and managing sports venues. It serves as a marketplace connecting sports enthusiasts (Users) with venue owners (Renters), facilitating easy discovery, real-time availability checking, and secure booking of sports facilities.

## 🚀 Features

### For Users (Athletes)

-   **Discover Venues:** Search and filter sports venues by location, sport type, and availability.
-   **Real-Time Booking:** View up-to-date schedules and book fields instantly.
-   **Reviews & Ratings:** Share experiences and read reviews to make informed decisions.
-   **Booking History:** Track past and upcoming games.
-   **Mobile Responsive:** Optimized for both desktop and mobile devices.

### For Renters (Venue Owners)

-   **Venue Management:** Create and manage multiple venues with detailed descriptions, amenities, and location data.
-   **Field Management:** Add fields/courts with specific pricing, sport types, and photos.
-   **Schedule Control:** Set operating hours, handle special closures, and manage availability.
-   **Booking Oversight:** View and manage incoming bookings, confirm payments, and track revenue.
-   **Dashboard:** Access insights on venue performance and booking trends.

### For Admins

-   **User Management:** Oversee all platform users and venue owners.
-   **Venue Approval:** Review and approve new venue listings to ensure quality.
-   **Sport Type Management:** Manage the categories of sports supported by the platform.

## 🛠️ Tech Stack

**Frontend:**

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **State/Data:** React Query / Axios
-   **Form Handling:** React Hook Form & Zod

**Backend:**

-   **Runtime:** Node.js
-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** TypeScript
-   **Database:** PostgreSQL
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Security:** Helmet, CORS, Rate Limiting
-   **Storage:** ImageKit (for image uploads)
-   **Email:** Nodemailer

## 📦 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   pnpm (recommended) or npm
-   PostgreSQL database

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ztzrk/fieldmax.git
    cd fieldmax
    ```

2.  **Setup Backend**

    ```bash
    cd backend
    pnpm install

    # Configure Environment Variables
    # Create .env file and update with your Database URL, JWT Secret, ImageKit keys, and SMTP details
    cp .env.example .env

    # Run Migrations
    npx prisma migrate dev

    # Seed Database (Optional - for testing data)
    npx prisma db seed

    # Start Dev Server (Runs on Port 3000 by default)
    pnpm run dev
    ```

3.  **Setup Frontend**

    ```bash
    cd ../frontend
    pnpm install

    # Configure Environment Variables
    # Create .env.local file
    cp .env.example .env.local

    # Start Dev Server (Runs on Port 3001 if backend is 3000)
    pnpm run dev
    ```

4.  **Access the Application**
    -   Frontend: [http://localhost:3001](http://localhost:3001) (or port displayed in terminal)
    -   Backend API: [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
fieldmax/
├── backend/                # Express.js API
│   ├── src/
│   │   ├── auth/          # Authentication logic
│   │   ├── bookings/      # Booking module
│   │   ├── fields/        # Field management
│   │   ├── venues/        # Venue management
│   │   ├── prisma/        # Database schema & seeds
│   │   └── ...
│   └── ...
│
└── frontend/               # Next.js Application
    ├── src/
    │   ├── app/           # App Router pages
    │   ├── components/    # Reusable UI components
    │   ├── hooks/         # Custom React hooks
    │   ├── lib/           # Utilities (API, Schema, Types)
    │   └── ...
    └── ...
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
