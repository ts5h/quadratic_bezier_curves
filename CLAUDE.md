# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application that creates generative, gravitational quadratic Bézier curves. It's built with Create React App and uses Jotai for state management.

## Development Commands

### Running the Development Server
```bash
pnpm start
```
Opens [http://localhost:3000](http://localhost:3000) with hot reload enabled.

### Building for Production
```bash
pnpm build
```
Creates optimized production build in the `build` folder.

### Running Tests
```bash
pnpm test
```
Runs Jest tests in interactive watch mode.

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
- **Canvas Optimization**: Different canvas sizes for mobile (4000x4000) vs desktop (6000x5000) due to mobile pixel limitations
- **React 19** with TypeScript 5.9
- **Biome** for code formatting (2 spaces, 80 char line width)
- **ESLint** for linting with React App configuration
- Package manager: **pnpm** (v10.14.0)

### Testing
- Jest with React Testing Library
- Test files located in `src/__test__/`
- Setup file: `src/setupTests.ts`