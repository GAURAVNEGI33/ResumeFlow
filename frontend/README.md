# ResumeFlow frontend

Angular 13 frontend for the ResumeFlow resume builder. The public landing page and signed-in workspace use the same ivory, teal and mint design system.

## Run locally

Use Node.js 16 for this Angular version.

```bash
npm install
npm start
```

Open `http://localhost:4200`. During development the frontend calls `http://localhost:4000/api`; change `projects/web/src/environments/environment.ts` if your backend runs elsewhere. Production uses the same-origin `/api` path.

## Main routes

- `/` — public landing page
- `/auth/login` and `/auth/signup` — authentication
- `/dashboard` — counts, recent documents and application pipeline
- `/documents` — search, filter, create, duplicate and delete
- `/templates` — template gallery and simple template builder
- `/applications` — drag-and-drop board and table view
- `/shares` — published links
- `/exports` — export hand-off
- `/editor/:id` — editor, live preview, settings, versions and shares

## Code map

- `projects/web/src/app/workspace/components` — reusable signed-in navigation
- `projects/web/src/app/workspace/pages` — one folder per workspace screen
- `projects/web/src/app/workspace/services` — typed API calls
- `projects/web/src/app/workspace/models` — shared TypeScript interfaces
- `projects/web/src/styles.scss` — global design tokens and reusable workspace styles

The signed-in screens use semantic elements such as `main`, `article`, `section`, `header`, `footer`, `nav`, `aside`, `figure`, lists and tables. Shared layout styles and services keep markup and API code from being repeated.

## Build check

```bash
npm run build
```

Authentication headers are attached only to the configured API URL, protected routes re-check authentication on child navigation, and production avoids a hardcoded insecure API host. Server-side validation, authorization, rate limiting, secure cookies and public-share retrieval belong to the backend phase.
