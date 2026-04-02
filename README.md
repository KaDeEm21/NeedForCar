# Need For Car

One-page premium car rental landing page inspired by the Figma design for `Need For Car`.

## Stack

- React
- Vite
- TypeScript
- CSS
- Node.js
- Express

## Features

- responsive one-page layout with anchor navigation
- hero booking module with reference artwork
- fleet showcase using local style-reference images from `assets/`
- benefits and booking steps sections
- booking flow with sticky summary
- FAQ section
- sign-in and sign-up modals
- backend inquiry endpoint with JSON file persistence

## Run

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Start backend:

```bash
npm run dev:server
```

Build frontend:

```bash
npm run build
```

## API

- `GET /api/health`
- `GET /api/fleet`
- `GET /api/faq`
- `GET /api/recent-bookings`
- `POST /api/inquiries`

## Notes

- The current UI uses the local reference images from `assets/` as temporary artwork so the layout stays close to the desired visual style.
