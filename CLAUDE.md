# Leomars Properties ERP Dashboard

## Project Location
- **Code**: `C:\Users\syeda\leomars-portfolio`
- **Live URL**: https://leomars-portfolio.vercel.app
- **GitHub**: https://github.com/amiradnanptcl-hue/Leomars-Properties-ERP-Dashboard
- **Firebase Console**: https://console.firebase.google.com/project/properties-portfolio

## Tech Stack
- React 19 + Vite 7 + Tailwind CSS 4
- Firebase Auth (Email/Password) + Firestore (real-time sync)
- Recharts 3, Framer Motion 12, Lucide React, SheetJS (xlsx)
- Deployed on Vercel (free plan)
- All services on free tier ($0/month)

## Architecture
- **Single-file app**: `src/App.jsx` (~4700 lines) — all components, views, data, translations
- **Auth**: `src/AuthContext.jsx` — Firebase auth with role caching in sessionStorage
- **Database sync**: `src/useFirestoreSync.js` — Firestore real-time listeners with localStorage cache
- **Login**: `src/LoginScreen.jsx` — dark-themed login screen
- **Firebase config**: `src/firebase.js` — reads from VITE_ env vars

## 5 User Accounts
| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@leomars.app | Admin123 | admin | Full access (add, edit, delete) |
| syed@leomars.app | Syed123 | admin | Full access (add, edit, delete) |
| dubai@leomars.app | Dubai123 | accountant | Add + Edit. Delete shows "request approval" toast |
| turkey@leomars.app | China123 | accountant | Add + Edit. Delete shows "request approval" toast |
| viewer@leomars.app | Syed123 | viewer | Read-only. No add/edit/delete buttons |

## Firestore Data Model
```
appData/properties → { items: [...], deletedIds: [...], lastModifiedBy, lastModifiedAt }
appData/legalCases → { items: [...], lastModifiedBy, lastModifiedAt }
appData/backups    → { items: [...], lastModifiedAt }
userRoles/{uid}    → { email, role, name }
```

## Firebase Env Vars
Stored in Vercel (production) and `.env.local` (local dev).
Never commit these to git. To view them run: `npx vercel env ls production`
Project ID: `properties-portfolio` | Region: `europe-west1`

## Key Features
- Multi-region portfolio dashboard (Dubai AED + Turkey TRY)
- Live exchange rates (6 API sources with failover)
- CAGR% stacked bar charts
- Tenant lifecycle (add, edit, end tenancy → Vacant, new tenancy)
- Commercial multi-unit buildings with per-shop management
- Legal case tracker linked to properties
- Excel export (all, by region, individual)
- Bilingual (English / Chinese)
- Real-time sync — all users see changes instantly
- Backup & restore system
- Change Password in sidebar menu
- Role-based delete permissions with approval toast
- Notification ticker (Expired, Near Expiry, Legal Case, Vacant)

## Performance Optimizations
- Code-split into 7 chunks (React, Firebase, Recharts, Framer Motion, SheetJS, App, index)
- HTML splash screen (shows before any JS loads)
- Preconnect hints for Firebase/Google domains
- Auth role cached in sessionStorage (instant on refresh)
- Firestore data cached in localStorage (dashboard renders from cache, Firestore syncs in background)

## Deploy Workflow
```bash
npm run build && npx vercel --prod --yes
git add -A && git commit -m "description" && git push origin main
```

## Important Notes
- NEVER use `echo` to pipe env vars to `vercel env add` — it adds trailing newlines causing Firestore 503 errors. Use `printf` instead.
- The `dk` variable in App.jsx controls dark/light logic: `dk = theme === 'executive'`
- Themes: 'dark' (Midnight) and 'executive' (Executive). Light theme was removed.
- The app uses `PROPERTY_COLORS` map for consistent per-property color coding across charts and cards.
- DEFAULT_PROPERTIES contains ~49 properties (Dubai + Turkey) with full rent schedules.
