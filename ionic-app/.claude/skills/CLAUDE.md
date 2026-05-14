# finds — Code Conventions

## Stack
Vue 3 + Ionic + Capacitor + Supabase + Pinia + Vue Router + TypeScript + Tailwind

## Folder Structure
```
src/
  types/                  # shared TypeScript types
    entities.ts           # app/domain models used by composables and views
    dto.ts                # service payloads and DTOs
    supabase.ts           # raw DB row shapes, used only by services
    index.ts              # type-only barrel exports
  constants/              # shared constants
    communities.ts        # community metadata and colors
    routes.ts             # route path constants
    storage.ts            # bucket names and upload config
    users.ts              # profile validation rules
    index.ts
  services/               # domain-scoped API/HTTP layer
    supabase.ts           # Supabase client singleton
    <domain>.service.ts   # named async functions returning DTOs
  stores/                 # Pinia stores (global state only)
  composables/            # shared composables (used by 2+ pages)
  components/             # shared design-system components
  utils/                  # pure helpers, no business logic
  views/
    <page-name>/      # one folder per page/route
      <Page>Page.vue  # orchestrator view — composable wiring only
      use<Page>.ts    # feature composable — all reactive state and handlers
      components/     # feature-local dumb/presentational components
```

## Vue SFC Rules
- `<script setup>` always comes **before** `<template>`
- Use `const fn = () => {}` — never `function fn() {}`
- Views contain zero business logic — only composable destructuring and prop/event wiring
- Page views are orchestrators: data flows down as props, events flow up to composable methods
- Child components are dumb: props in, events out, no stores, no services, no routing
- No inline data that belongs in constants or types

## Composables
- Named `use<PageName>.ts`, export a single `const use<PageName> = () => {}`
- Own all reactive state (`ref`, `computed`) for their page
- Call services for data — no raw Supabase calls inside composables
- Return a flat object of everything the view needs

## Services
- All Supabase queries and HTTP calls live here, organized by domain (`users.service.ts`, `finds.service.ts`, etc.)
- Services return DTOs/domain objects, never raw Supabase responses
- Map raw DB rows from snake_case to app-facing camelCase inside services
- Always `throw` on error — let the composable handle it
- Const arrow functions, named exports only

## Stores
- Pinia only for truly global state: auth session, user profile
- Stores call services instead of raw Supabase queries
- No loading spinners, no UI state in stores

## Types and Constants
- Shared interfaces, DTOs, payload types, and raw DB rows live in `src/types/`
- Shared constants live in `src/constants/`
- Feature-local types/constants are allowed only when they are truly private to a single feature

## Design System
**Colors:** forest `#1A3C34` · moss `#2D6A4F` · sage `#52B788` · mint `#D8F3DC` · cream `#F8F4EF` · sand `#E8DDD0` · ember `#E07A5F` · gold `#F2CC60` · app bg `#0E1F1A`
**Fonts:** `font-display` → Fraunces · `font-body` → DM Sans
**Aesthetic:** modern, non-native — think Duolingo / BeReal / Strava. No default Ionic chrome.

## Communities
`rare_bizarre` · `everyday_beauty` · `hyperlocal` · `before_its_gone` · `patterns` · `human_traces` · `overlooked_ordinary`
