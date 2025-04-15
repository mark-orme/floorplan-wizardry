
# Project Scripts

This directory contains utility scripts for managing the project.

## Available Scripts

### check-exports.sh
Analyzes the project for potential duplicate exports that could cause build failures.

```bash
# Run the export check
./scripts/check-exports.sh
```

### check-duplicate-exports.sh
Pre-commit hook to detect duplicate exports in files being committed.

### type-check.sh
Runs TypeScript type checking to find errors before they cause build failures.

### setup-husky.sh
Sets up Git hooks for the project, including pre-commit checks.

### run-depcheck.sh
Checks for unused dependencies in the project.

## Setting Up

Make the scripts executable:

```bash
chmod +x scripts/*.sh
```

Initialize Husky for Git hooks:

```bash
./scripts/setup-husky.sh
```
