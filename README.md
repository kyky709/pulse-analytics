# Pulse Analytics

> Real-time insights for modern businesses

A modern, fullstack analytics dashboard built with Next.js 14, Supabase, Tailwind CSS, and Recharts.

## Features

- **Authentication** - Secure login/signup with Supabase Auth
- **Dashboard** - Real-time KPIs, charts, and metrics
- **Analytics** - Detailed insights with filters and export
- **User Management** - Full CRUD operations with search and filters
- **Settings** - Profile management and preferences
- **Dark/Light Mode** - System-aware theme switching
- **Responsive** - Mobile-first design

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Supabase (Auth + Database) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Notifications | Sonner |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema script:
   - Copy contents of `supabase/schema.sql`
   - Paste and run in SQL Editor
3. Run the seed script for demo data:
   - Copy contents of `supabase/seed.sql`
   - Paste and run in SQL Editor

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home redirect
├── components/
│   ├── auth/            # Auth components
│   ├── charts/          # Recharts wrappers
│   ├── dashboard/       # Dashboard widgets
│   ├── layout/          # Sidebar, Header
│   ├── ui/              # Reusable UI components
│   └── users/           # User management
├── hooks/               # Custom React hooks
├── lib/
│   ├── supabase/        # Supabase client config
│   ├── constants.ts     # App constants
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Database Schema

The application uses the following tables:

- **profiles** - User profiles (extends Supabase auth.users)
- **customers** - Customer/user data for demo
- **revenue** - Revenue metrics
- **traffic** - Traffic analytics
- **conversions** - Conversion funnel data
- **activities** - Recent activity log
- **products** - Product catalog

See `supabase/schema.sql` for complete schema.

## Customization

### Theme Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: #3B82F6;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
}
```

### Adding New Pages

1. Create a new folder in `src/app/(dashboard)/`
2. Add `page.tsx` with your component
3. Update navigation in `src/components/layout/Sidebar.tsx`



## License

MIT License - feel free to use for personal or commercial projects.
