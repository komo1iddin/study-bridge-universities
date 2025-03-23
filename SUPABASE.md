# Supabase Integration Guide

This document provides guidance on how to work with Supabase in this project, both locally and in production.

## Local Development

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (must be running)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (installed via Homebrew: `brew install supabase/tap/supabase`)
- Node.js and npm

### Starting the Local Supabase Server

To start the local Supabase server, run:

```bash
supabase start
```

This command will:
1. Start a PostgreSQL database
2. Start the Supabase APIs and services
3. Provide you with local credentials

### Accessing Local Supabase Services

- **Studio UI**: http://localhost:54323
- **API URL**: http://localhost:54321
- **Database URL**: postgresql://postgres:postgres@localhost:54322/postgres

### Database Migrations

When you make changes to your database schema:

1. Create a new migration:
   ```bash
   supabase db diff --schema public -f migration_name
   ```

2. Apply migrations:
   ```bash
   supabase db push
   ```

## Production Deployment

### Setting Up a Supabase Project

1. Create a new project on [Supabase](https://app.supabase.io)
2. Update the environment variables in your production environment:
   - `NEXT_PUBLIC_SUPABASE_URL` - Get from Supabase project settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from Supabase project API settings

### Migrating Local Changes to Production

To migrate your local schema changes to production:

1. Link your local project to your remote Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Push your local migrations to production:
   ```bash
   supabase db push
   ```

## Working with Supabase in the Application

### Important: Server Components vs Client Components

In Next.js with the App Router, page components are Server Components by default. Since Supabase client operations need to run on the client side, you'll need to use the `'use client'` directive or create client component wrappers.

Example of a client component wrapper:

```tsx
// src/components/ClientComponentWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const SupabaseConnectionTest = dynamic(
  () => import('@/components/SupabaseConnectionTest'),
  { ssr: false }
);

export default function ClientComponentWrapper() {
  return <SupabaseConnectionTest />;
}
```

Then use it in your page components:

```tsx
// src/app/page.tsx
import ClientComponentWrapper from "@/components/ClientComponentWrapper";

export default function Page() {
  return <ClientComponentWrapper />;
}
```

### Authentication

Supabase provides built-in authentication. Example usage:

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'password'
});

// Sign out
await supabase.auth.signOut();
```

### Database Operations

Example of basic database operations:

```typescript
import { supabase } from '@/lib/supabase';

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' });

// Select data
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', 1);

// Delete data
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', 1);
```

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Library](https://supabase.com/docs/reference/javascript/initializing)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) 