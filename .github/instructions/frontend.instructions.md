---
applyTo: "app/**/*.tsx,components/**/*.tsx,components/**/*.ts"
---

# Frontend Instructions

## UI Philosophy
- Keep UI minimal, cinematic, and modern
- Prefer clean spacing over dense layouts
- Prioritize mobile-first responsive design
- Avoid visual clutter
- Use subtle animations only when meaningful

## Framework Standards
- Use Next.js App Router conventions
- Prefer Server Components unless interactivity is required
- Use Client Components only when necessary
- Prefer async server functions for data fetching

## Component Rules
- Keep components small and reusable
- One component should solve one responsibility
- Extract repeated UI patterns into shared components
- Prefer composition over deeply nested props

## Tailwind Standards
- Prefer Tailwind utility classes
- Group related classes logically
- Avoid excessive class duplication
- Use responsive breakpoints consistently
- Prefer gap utilities over margin hacks

## Styling Rules
- Avoid inline styles
- Avoid hardcoded colors when theme tokens exist
- Prefer consistent spacing scale
- Use rounded-2xl for modern card layouts
- Prefer shadow-sm to heavy shadows

## Accessibility
- Always include alt text for images
- Buttons must have accessible labels
- Maintain proper heading hierarchy
- Ensure keyboard navigation works
- Prefer semantic HTML

## Performance
- Optimize image rendering
- Use lazy loading when appropriate
- Avoid unnecessary client-side rendering
- Minimize large dependency imports
- Prevent unnecessary re-renders

## Animation
- Use Framer Motion conservatively
- Prefer smooth opacity and transform transitions
- Avoid excessive bouncing or distracting motion
- Keep animations under 300ms unless cinematic effect is intended

## Forms
- Validate inputs properly
- Show user-friendly error states
- Disable submit buttons during async operations
- Use optimistic UI carefully

## State Management
- Prefer local state first
- Avoid global state unless necessary
- Keep state shape predictable
- Avoid prop drilling when context is cleaner

## Code Quality
- Prefer TypeScript types over any
- Avoid deeply nested conditionals
- Use early returns
- Keep JSX readable
- Remove dead code immediately

## AI Output Preferences
- Generate complete production-ready components
- Include loading states when relevant
- Include empty states when relevant
- Include responsive behavior by default
- Explain architectural decisions briefly

## Design Language
- Dark-mode friendly UI
- Soft gradients are allowed
- Glassmorphism should be subtle
- Prefer cinematic product presentation
- Emphasize premium visual hierarchy

## Forbidden Patterns
- Do not use massive single-file components
- Do not hardcode secrets
- Do not use random z-index values
- Do not use unnecessary useEffect hooks
- Do not generate unused imports
