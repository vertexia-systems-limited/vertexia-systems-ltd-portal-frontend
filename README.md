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

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and create pull requests for changes. Follow the existing code style and run tests/lint before submitting.

## License

Specify your license here (e.g. MIT) or add a LICENSE file.

---

If you'd like, I can update this README with screenshots, live demo links, or CI/CD instructions. Want me to add those now?
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
