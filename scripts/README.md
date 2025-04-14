
# Project Scripts

This directory contains helpful scripts for development and maintenance.

## Available Scripts

- `type-check.sh`: Runs TypeScript compiler with strict settings to catch type errors
- `run-depcheck.sh`: Analyzes the project for unused dependencies
- `setup-husky.sh`: Sets up husky with commitlint for commit message validation
- `commit-msg`: Custom husky hook for commitlint integration

## How to Use

1. Make scripts executable:
   ```
   chmod +x scripts/*.sh
   ```

2. Run a script:
   ```
   ./scripts/type-check.sh
   ```

## Commit Message Format

This project uses commitlint to enforce a conventional commit format:

```
<type>(<scope>): <subject>
```

Types include:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit
- `grid`: Changes related to the grid system
- `canvas`: Changes related to the canvas

Example: `feat(grid): add support for custom grid sizes`
