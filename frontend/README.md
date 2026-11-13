# FoodTrace — React Conversion

Your original HTML/CSS/JS project (11 pages) converted to a React app using
**Vite + React Router + CSS Modules**. All responsive breakpoints from your
original CSS have been preserved, plus a few added where the original had
none (noted below).

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

## Structure

```
src/
  components/
    Navbar/      -> public navbar (Home page)
    Sidebar/      -> shared dashboard sidebar (all logged-in pages)
    Layout/       -> wraps Sidebar + main content offset (250px / 70px responsive)
    Footer/       -> public footer (Home page)
  pages/
    Home/         -> index.html  (navbar, hero banner slider, features, stats, form, client info, contact, footer)
    Login/        -> login.html
    Logout/       -> logout.html
    Dashboard/    -> dashboard.html
    Farmers/      -> farmers.html
    Products/     -> products.html
    Tracking/     -> tracking.html
    Safety/       -> saftey.html
    Reports/      -> reports.html
    Profile/      -> profile.html
    Settings/     -> settings.html
  utils/
    auth.js       -> localStorage login-gate (mirrors your original JS redirect check)
    useCountUp.js -> reusable animated-number hook (dashboard cards, product counter)
  assets/images/  -> placeholder logo/banner/feature images (see note below)
```

Every page component has a matching `*.module.css` file directly beside it,
so class names are scoped and won't leak between pages — same organization
you had with one CSS file per HTML page, just modularized.

## What was converted 1:1

- **Auth gate**: every protected page calls `useRequireAuth()`, same behavior
  as your `if (localStorage.getItem("login") != "true") redirect` checks.
- **Farmers / Products**: full CRUD (add / delete / search) now uses React
  state + `useEffect` to sync with `localStorage`, replacing manual
  `innerHTML` table rebuilding.
- **Safety**: `setInterval` random temp/humidity polling -> `useEffect` + state.
- **Dashboard cards & Home product counter**: animated count-up -> custom
  `useCountUp` hook (same speed/step as your original `setTimeout`/`setInterval`).
- **Home banner slider**: `setInterval` image rotation -> state + `useEffect`.
- **Settings dark mode**: still toggles `document.body.style` exactly like
  the original, since that's a real DOM-level effect outside the component tree.
- **Login/Logout**: same `admin` / `1234` check and localStorage flag.

## Responsive design

All `@media` breakpoints from your original CSS files were carried over
unchanged (mainly `768px` sidebar-collapse and `1000px` / `900px` grid
breakpoints). A few pages (`reports.css`, `profile.css`, `login.css`,
`logout.css`) had **no** responsive rules in the original — light, clearly
commented mobile fixes were added there so those pages don't visually break
on small screens; search each `.module.css` for the word "added" to see
exactly where.

## Note on images

The uploads didn't include an `images/` folder, so `logo.png`, `banner1-3.png`,
`tracking.png`, `safety.png`, and `compliance.png` are placeholder graphics
generated to keep layouts intact. Drop your real files into
`src/assets/images/` (same filenames) to swap them in — no code changes needed.

## Note on navigation

The original site's sidebar didn't link to `settings.html` from other pages
(only reachable by typing the URL). A **Settings** link was added to the
shared Sidebar component so it's reachable like every other page — remove it
from `src/components/Sidebar/Sidebar.jsx` if you'd rather keep it hidden.
