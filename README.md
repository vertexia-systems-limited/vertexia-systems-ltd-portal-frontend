# Vertexia Systems Ltd — Portal Frontend

A modern admin portal frontend built with React, Vite and TypeScript. This repository contains the UI for Vertexia Systems Ltd's internal portal, including dashboards, projects, jobs, and settings built with a component-driven approach (Radix UI + shadcn-inspired primitives).

## Table of Contents

- Project overview
- Features
- Tech stack
- Project structure
- Getting started
- Available scripts
- Contributing
- License

## Project overview

This repository is the frontend application for Vertexia Systems Ltd's portal. It provides an admin interface with authentication, dashboards, project and job management, and site settings.

## Features

- Component-driven UI built from reusable primitives
- Responsive layout with sidebar and mobile navigation
- Forms with validation and accessible UI components
- Client-side routing with React Router
- Unit and integration tests via Vitest

## Tech stack

- React 18
- Vite (dev server & build)
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Vitest for testing
- Axios for API requests

## Project structure

- [src/](src/) — application source
  - [components/](src/components/) — UI components and layout
  - [pages/](src/pages/) — page-level routes
  - [services/](src/services/) — API clients
  - [contexts/](src/contexts/) — React contexts (Auth, Theme)
  - [hooks/](src/hooks/) — custom hooks

## Getting started

Prerequisites:

- Node.js v18+ (or Bun)
- npm, pnpm or yarn (optional)

Install dependencies:

```bash
npm install
# or
pnpm install
# or with Bun
bun install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

Lint the project:

```bash
npm run lint
```

## Available scripts

The following npm scripts are defined in `package.json`:

- `dev` — start Vite development server
- `build` — produce a production build
- `build:dev` — build in development mode
- `preview` — serve a local preview of the production build
- `lint` — run ESLint
- `test` — run Vitest once
- `test:watch` — run Vitest in watch mode

