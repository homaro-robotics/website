# Homaro Robotics — website

Marketing site for Homaro Robotics (Task Assurance for robots). Next.js 16 App Router, TypeScript, Tailwind v4.

Requires Node.js 20.9+. Install with `npm install`.

## Run

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Structure

```
src/
  app/
    layout.tsx         root layout: fonts, metadata, header/footer
    page.tsx           /               home
    how-it-works/      /how-it-works   four-step walkthrough
    globals.css        Tailwind + brand tokens
  components/          header, footer, Book a call button, icons, product simulations
  content/site.ts      shared constants: name, nav, booking URL, email
public/brand/          logo files
```

Design rules and scope: see CLAUDE.md.
