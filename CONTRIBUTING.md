# Contributing to Study Bridge

We love your input! We want to make contributing to Study Bridge as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Git Workflow

1. Fork the repository (for external contributors)
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes
4. Commit your changes:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open a Pull Request

### Branching Strategy

- `main`: The primary branch containing production-ready code
- `develop`: The integration branch for features
- Feature branches: Named `feature/your-feature-name`
- Bug fix branches: Named `fix/bug-name`

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Requests

1. Update the README.md with details of changes to the interface, if applicable
2. Update the documentation with details of any API changes, if applicable
3. The PR should work for the target environments (browsers, Node.js versions)
4. Include relevant test cases

## Supabase Development

When making changes to the database schema or Supabase configuration:

1. Create a migration:
   ```bash
   supabase db diff --schema public -f your_migration_name
   ```

2. Document API changes in the appropriate documentation files

## License

By contributing, you agree that your contributions will be licensed under the project's license. 