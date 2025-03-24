# Study Bridge

Study Bridge is a platform that helps international students find and apply to universities in China.

## Features

- Internationalization (i18n) support for English, Russian, and Uzbek
- University catalog with detailed information
- Program search and filtering
- Scholarship information
- User authentication and application tracking

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- TailwindCSS
- next-intl for internationalization
- Supabase for backend and authentication

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd study-bridge
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Internationalization

The application supports multiple languages:
- English (en) - default
- Russian (ru)
- Uzbek (uz)

Translation files are located in `src/i18n/locales/{locale}` directories.

## Project Structure

- `src/app` - Next.js App Router pages and layouts
- `src/components` - Reusable React components
- `src/i18n` - Internationalization configuration and translation files
- `src/lib` - Utility functions and database interactions

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Supabase Integration

This project uses Supabase for:
- Database storage
- Authentication
- Realtime subscriptions
- Storage (files, images)

For more detailed information on working with Supabase in this project, see [SUPABASE.md](SUPABASE.md).

### Authentication Flow

The authentication system uses Supabase Auth with cookie-based session handling for server-side rendering. Key components:

- Client-side authentication with `createClient()` from `@supabase/ssr`
- Server-side session verification with `createServerSupabaseClient()`
- Middleware protection for routes
- Session debugging and persistence improvements

#### Authentication Debugging

To debug authentication issues:

1. Use the test script to check session status:
   ```bash
   ./test-auth-flow.sh
   ```

2. Check browser developer tools:
   - Network tab to verify cookie handling
   - Console logs showing session state
   - Application tab to inspect cookies

3. Server logs show detailed cookie and session information with the `DEBUG=*` environment variable:
   ```bash
   DEBUG=* npm run dev
   ```

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
