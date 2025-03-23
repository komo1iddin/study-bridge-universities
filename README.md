# Study Bridge

A Next.js application with Supabase integration for local development and production.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)

### Setup

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd study-bridge-cursor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Supabase local development environment:
   ```bash
   supabase start
   ```

4. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```
   Update the values if needed (anon key should match what's shown in the Supabase CLI output).

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Integration

This project uses Supabase for:
- Database storage
- Authentication
- Realtime subscriptions
- Storage (files, images)

For more detailed information on working with Supabase in this project, see [SUPABASE.md](SUPABASE.md).

## Deployment

When you're ready to deploy to production:

1. Create a new Supabase project on [supabase.com](https://supabase.com)
2. Link your local project to your remote Supabase project
3. Update your production environment variables
4. Deploy your Next.js application to your preferred hosting provider

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
