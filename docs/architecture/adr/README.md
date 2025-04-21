
# Architectural Decision Records

This directory contains Architecture Decision Records (ADRs) that document significant architectural decisions made in this project.

## What is an ADR?

An Architectural Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## ADR Format

Each ADR file follows this format:

- **Title**: Short phrase describing the decision
- **Date**: When the decision was made
- **Status**: Proposed, Accepted, Deprecated, Superseded, etc.
- **Context**: What is the issue that we're addressing?
- **Decision**: What is the change that we're making?
- **Consequences**: What becomes easier or more difficult because of this change?

## ADR List

- [ADR-0001](0001-web-workers-for-geometry.md): Web Workers for Geometry Calculations
- [ADR-0002](0002-viewport-culling.md): Viewport-Based Culling for Canvas Rendering

## Creating a New ADR

When creating a new ADR:

1. Copy the template file (`0000-template.md`)
2. Rename it with the next sequential number and a brief description
3. Fill in the details
4. Submit a PR for review

## References

- [Documenting Architecture Decisions by Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
