# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application that creates generative, gravitational quadratic Bézier curves. It's built with Vite and uses Jotai for state management.

## Development Commands

### Running the Development Server
```bash
pnpm dev
```
Opens [http://localhost:3000](http://localhost:3000) with hot reload enabled using Vite.

### Building for Production
```bash
pnpm build
```
Creates optimized production build in the `build` folder.

### Preview Production Build
```bash
pnpm preview
```
Serves the production build locally for testing.

### Testing with Vitest
```bash
pnpm test          # Run tests in watch mode
pnpm test:ui       # Run tests with UI interface
pnpm test:coverage # Run tests with coverage report
```

### Linting and Formatting with Biome
```bash
pnpm lint        # Check for linting errors
pnpm lint:fix    # Fix linting errors automatically
pnpm format      # Format code
pnpm check       # Run both linting and formatting checks
pnpm check:fix   # Fix both linting and formatting issues
```

## Project Architecture

### State Management
- Uses **Jotai** for atomic state management
- Global atoms are located in `src/store/global/atoms/`
- Audio context and sound settings are managed as global state

### Component Structure
- **App.tsx**: Main application component that orchestrates the UI
- **Curve component** (`src/components/Curve/`): Core component that renders the animated Bézier curves on a canvas
  - Handles both desktop and mobile with different canvas sizes and point counts
  - Uses gravitational physics simulation for point movement
- **ReturnToHome** and **GitHub** components: Navigation/utility components with theme support

### Styling
- SCSS modules for component-specific styles
- Global variables in `src/scss/configs/_variables.scss`
- Component styles in `src/scss/components/`

### Key Technical Details
- **Build Tool**: Vite for fast development and optimized production builds
- **Testing**: Vitest with React Testing Library for unit and component tests
- **Canvas Optimization**: Different canvas sizes for mobile (4000x4000) vs desktop (6000x5000) due to mobile pixel limitations
- **React 19** with TypeScript 5.9
- **Biome** for both linting and formatting (2 spaces, 80 char line width)
- Package manager: **pnpm** (v10.14.0)

### Testing
- Test files are located alongside components (e.g., `App.test.tsx`, `Curve.test.tsx`)
- Setup file: `src/test/setup.ts` (includes Canvas API mocks and test utilities)
- Run `pnpm test` to start tests in watch mode