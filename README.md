# MotoTracker

A motorcycle maintenance and fuel log tracker built with React and TypeScript. Log fuel fill-ups and service visits, track fuel efficiency over time, and get reminded when your next service is due.

## Features

- Log fuel fill-ups and service entries through a single form with type-specific fields
- Dashboard summarizing last fill-up, last service, and next service due
- Automatic service-due reminder banner when mileage is close to (or past) the next service point
- Fuel efficiency (km/l) calculated per fill-up interval, not just a flat average
- Full edit and delete support for any entry
- Data persists across page refreshes via localStorage

## Tech stack

- React + TypeScript (Vite)
- React Router for page navigation
- Context API + useReducer for state management
- Plain CSS (custom properties, no framework)

## Data model

Entries use a discriminated union (`FuelEntry | ServiceEntry`) so TypeScript can safely narrow entry-specific fields (like `liters` vs `serviceType`) based on a shared `type` field, without type assertions.

## Running locally

\`\`\`bash
git clone https://github.com/yourusername/moto-tracker.git
cd moto-tracker
npm install
npm run dev
\`\`\`

## Possible next steps

- Overall average fuel efficiency alongside per-interval numbers
- Filtering/searching entry history
- Exporting logs as CSV