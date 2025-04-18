
# Contributing to Floor Plan Designer

## 🎯 Project Goals

Our mission is to create the most intuitive and powerful web-based floor plan design tool, focusing on:
- Precision drawing capabilities
- Innovative collaboration features
- Exceptional user experience
- Robust performance and accessibility

## 💻 Development Setup

### Prerequisites
- Node.js 18+ (recommended)
- npm 9+
- Git
- A modern web browser

### Local Development

1. Fork the repository on GitHub
2. Clone your forked repository
```bash
git clone https://github.com/[YOUR_USERNAME]/floor-plan-editor.git
cd floor-plan-editor
```

3. Install dependencies
```bash
npm install
```

4. Start development server
```bash
npm run dev
```

5. Run tests
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:e2e   # End-to-end tests
```

## 🔍 Development Workflow

### Branching Strategy
- `main`: Stable production branch
- `develop`: Active development branch
- Feature branches: `feature/description-of-change`
- Bugfix branches: `bugfix/description-of-issue`

### Commit Guidelines
- Use conventional commits
- Format: `<type>(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```bash
git commit -m "feat(canvas): add straight line drawing tool"
```

## 🧪 Testing

- 100% test coverage for utility functions
- Component tests with React Testing Library
- E2E tests with Playwright
- Accessibility tests with Axe

## 📝 Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- No `any` types
- Explicit return types
- JSDoc comments for public functions

## 🚀 Pull Request Process

1. Create a feature branch
2. Implement your changes
3. Write tests
4. Run `npm test` and ensure all tests pass
5. Submit a pull request to `develop` branch
6. Describe changes in PR description

## 🤝 Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) Code of Conduct.

## 💡 Need Help?

- Open an issue on GitHub
- Join our community discussions
- Check our [documentation](docs/)
