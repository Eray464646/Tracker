# Contributing to HabitFlow

Thank you for considering contributing to HabitFlow! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/Tracker.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Use Tailwind CSS for styling (no inline styles)

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add water tracker with progress ring`

## Pull Request Guidelines

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what changes you made and why
3. **Screenshots**: Include screenshots for UI changes
4. **Testing**: Describe how you tested your changes
5. **Breaking Changes**: Clearly mark any breaking changes

## Testing

Before submitting a PR:

- [ ] Test on desktop browser (Chrome, Safari, Firefox)
- [ ] Test on mobile browser (iOS Safari, Android Chrome)
- [ ] Test as installed PWA on mobile device
- [ ] Verify offline functionality
- [ ] Check console for errors
- [ ] Run `npm run build` successfully
- [ ] Run `npm run lint` without errors

## iOS Testing Checklist

If your changes affect the PWA or iOS functionality:

- [ ] Test installation on iOS home screen
- [ ] Verify standalone mode works correctly
- [ ] Check safe area insets on iPhone with notch
- [ ] Test pull-to-refresh is prevented
- [ ] Verify smooth animations (60 FPS)
- [ ] Test landscape and portrait orientations

## Feature Requests

Feature requests are welcome! Please:

1. Check existing issues first
2. Clearly describe the feature
3. Explain the use case
4. Provide mockups if applicable (for UI features)
5. Consider iOS design guidelines

## Bug Reports

When reporting bugs, include:

1. Description of the bug
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots or screen recordings
6. Device/browser information
7. Console errors (if any)

## Priority Features

The following features are high priority:

- Water Tracker with progress ring
- Supplement Tracker
- IndexedDB implementation
- Push notifications
- Dark mode
- Multi-language support

## Areas Needing Help

- Icon design (need actual PNG icons)
- Accessibility improvements
- Performance optimization
- Unit tests
- E2E tests
- Documentation

## Code Review Process

1. All PRs require at least one approval
2. Automated checks must pass (linting, build)
3. Security scan must pass
4. Changes should be minimal and focused
5. Follow the project's architecture

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
