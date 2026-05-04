# 🔄 Migration Plan: Next.js to React Router

## Project Overview
**Current State**: Next.js 15.5.15 App Router with Cloudflare Workers deployment
**Target State**: React Router v7 SPA/SSR with Cloudflare Workers
**Project**: SoundGang Music Label Platform

## ✅ MIGRATION STATUS: PUBLIC SITE COMPLETE!

**Completed**: All public-facing pages migrated and working (9 routes)
**Remaining**: Admin dashboard (24+ routes) - Optional
**Progress Document**: See `../react-app/MIGRATION-PROGRESS.md` for detailed status

---

## 📊 Current Architecture Analysis

### File Structure
```
sg-app/
├── app/
│   ├── (site)/              # Public-facing pages (8 routes)
│   │   ├── page.tsx         # Home
│   │   ├── about/
│   │   ├── artists/
│   │   ├── blog/
│   │   ├── contact/
│   │   └── releases/
│   ├── admin/               # Admin dashboard (24+ routes)
│   │   ├── artists/
│   │   ├── blog/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── login/
│   │   ├── media/
│   │   ├── player/
│   │   ├── portal/
│   │   ├── profile/
│   │   ├── releases/
│   │   ├── tracks/
│   │   └── videos/
│   ├── layout.tsx           # Root layout
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── components/              # 44 React components
├── lib/                     # 12 utility files
├── hooks/                   # 1 custom hook
├── api/                     # Separate backend API (Cloudflare Worker)
└── public/                  # Static assets
```

### Dependencies to Keep
- React 19.2.5
- React DOM 19.2.5
- Tailwind CSS 4
- shadcn/ui components
- @base-ui/react
- Editor.js ecosystem
- lucide-react icons
- next-themes (replace with custom theme solution)
- sonner (toast notifications)

### Dependencies to Remove
- Next.js 15.5.15
- @opennextjs/cloudflare
- eslint-config-next

### Dependencies to Add
- **react-router@^7** (latest v7)
- **react-router-dom@^7**
- **@remix-run/cloudflare** (for Cloudflare Workers deployment)
- **vite** (build tool)
- **@vitejs/plugin-react** (Vite React plugin)

---

## 🎯 Migration Strategy

### Phase 1: Project Setup & Configuration
**Duration**: 1-2 days  
**Goal**: Set up new React Router project structure

#### Tasks:
1. **Initialize New Project Structure**
   ```bash
   # Create new React Router project
   npx create-react-router@latest soundgang-app-v2
   cd soundgang-app-v2
   ```

2. **Install Dependencies**
   ```bash
   # Core
   npm install react-router@^7 react-router-dom@^7
   
   # Build tools
   npm install -D vite @vitejs/plugin-react
   
   # Cloudflare deployment
   npm install @remix-run/cloudflare
   
   # Existing dependencies
   npm install @base-ui/react @editorjs/{code,delimiter,editorjs,embed,header,image,list,paragraph,quote}
   npm install class-variance-authority clsx lucide-react sonner tailwind-merge tw-animate-css
   
   # Dev dependencies
   npm install -D @tailwindcss/postcss tailwindcss@^4 typescript @types/react @types/react-dom
   ```

3. **Configure Vite**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tsconfigPaths from 'vite-tsconfig-paths'
   
   export default defineConfig({
     plugins: [react(), tsconfigPaths()],
     server: {
       port: 3000
     },
     build: {
       outDir: 'dist',
       sourcemap: true
     }
   })
   ```

4. **Configure TypeScript**
   - Copy `tsconfig.json` from old project
   - Update paths for new structure
   - Remove Next.js specific types

5. **Configure Tailwind CSS**
   - Copy `tailwind.config.js` and `postcss.config.mjs`
   - Update content paths
   - Keep Tailwind 4 configuration

---

### Phase 2: Route Migration
**Duration**: 3-5 days  
**Goal**: Convert Next.js App Router to React Router routes

#### Next.js to React Router Mapping

##### Public Routes (Site)
| Next.js Path | React Router Path | Component |
|--------------|-------------------|-----------|
| `app/(site)/page.tsx` | `/` | `src/routes/index.tsx` |
| `app/(site)/about/page.tsx` | `/about` | `src/routes/about.tsx` |
| `app/(site)/artists/page.tsx` | `/artists` | `src/routes/artists/index.tsx` |
| `app/(site)/artists/[slug]/page.tsx` | `/artists/:slug` | `src/routes/artists/$slug.tsx` |
| `app/(site)/blog/page.tsx` | `/blog` | `src/routes/blog/index.tsx` |
| `app/(site)/blog/[id]/page.tsx` | `/blog/:id` | `src/routes/blog/$id.tsx` |
| `app/(site)/contact/page.tsx` | `/contact` | `src/routes/contact.tsx` |
| `app/(site)/releases/page.tsx` | `/releases` | `src/routes/releases.tsx` |

##### Admin Routes
| Next.js Path | React Router Path | Component |
|--------------|-------------------|-----------|
| `app/admin/page.tsx` | `/admin` | `src/routes/admin/index.tsx` |
| `app/admin/login/page.tsx` | `/admin/login` | `src/routes/admin/login.tsx` |
| `app/admin/dashboard/page.tsx` | `/admin/dashboard` | `src/routes/admin/dashboard.tsx` |
| `app/admin/artists/page.tsx` | `/admin/artists` | `src/routes/admin/artists/index.tsx` |
| `app/admin/artists/[id]/page.tsx` | `/admin/artists/:id` | `src/routes/admin/artists/$id.tsx` |
| `app/admin/blog/page.tsx` | `/admin/blog` | `src/routes/admin/blog/index.tsx` |
| `app/admin/blog/new/page.tsx` | `/admin/blog/new` | `src/routes/admin/blog/new.tsx` |
| `app/admin/blog/[id]/edit/page.tsx` | `/admin/blog/:id/edit` | `src/routes/admin/blog/$id.edit.tsx` |
| `app/admin/blog/categories/page.tsx` | `/admin/blog/categories` | `src/routes/admin/blog/categories.tsx` |
| `app/admin/events/page.tsx` | `/admin/events` | `src/routes/admin/events.tsx` |
| `app/admin/media/page.tsx` | `/admin/media` | `src/routes/admin/media.tsx` |
| `app/admin/player/page.tsx` | `/admin/player` | `src/routes/admin/player.tsx` |
| `app/admin/profile/page.tsx` | `/admin/profile` | `src/routes/admin/profile.tsx` |
| `app/admin/releases/page.tsx` | `/admin/releases` | `src/routes/admin/releases/index.tsx` |
| `app/admin/releases/[id]/page.tsx` | `/admin/releases/:id` | `src/routes/admin/releases/$id.tsx` |
| `app/admin/tracks/page.tsx` | `/admin/tracks` | `src/routes/admin/tracks.tsx` |
| `app/admin/videos/page.tsx` | `/admin/videos` | `src/routes/admin/videos.tsx` |
| `app/admin/portal/page.tsx` | `/admin/portal` | `src/routes/admin/portal/index.tsx` |
| `app/admin/portal/blog/page.tsx` | `/admin/portal/blog` | `src/routes/admin/portal/blog.tsx` |
| `app/admin/portal/events/page.tsx` | `/admin/portal/events` | `src/routes/admin/portal/events.tsx` |
| `app/admin/portal/releases/page.tsx` | `/admin/portal/releases` | `src/routes/admin/portal/releases.tsx` |
| `app/admin/portal/videos/page.tsx` | `/admin/portal/videos` | `src/routes/admin/portal/videos.tsx` |

#### New Directory Structure
```
src/
├── routes/
│   ├── index.tsx                        # Home
│   ├── about.tsx                        # About
│   ├── contact.tsx                      # Contact
│   ├── releases.tsx                     # Releases
│   ├── artists/
│   │   ├── index.tsx                    # Artists list
│   │   └── $slug.tsx                    # Artist detail
│   ├── blog/
│   │   ├── index.tsx                    # Blog list
│   │   └── $id.tsx                      # Blog post
│   └── admin/
│       ├── index.tsx                    # Admin home
│       ├── login.tsx                    # Login
│       ├── dashboard.tsx                # Dashboard
│       ├── artists/
│       │   ├── index.tsx
│       │   └── $id.tsx
│       ├── blog/
│       │   ├── index.tsx
│       │   ├── new.tsx
│       │   ├── categories.tsx
│       │   └── $id.edit.tsx
│       ├── events.tsx
│       ├── media.tsx
│       ├── player.tsx
│       ├── profile.tsx
│       ├── releases/
│       │   ├── index.tsx
│       │   └── $id.tsx
│       ├── tracks.tsx
│       ├── videos.tsx
│       └── portal/
│           ├── index.tsx
│           ├── blog.tsx
│           ├── events.tsx
│           ├── releases.tsx
│           └── videos.tsx
├── components/                          # Copy all 44 components
├── lib/                                 # Copy all utilities
├── hooks/                               # Copy all hooks
├── styles/
│   └── globals.css                      # Copy from app/globals.css
├── main.tsx                             # Entry point
└── router.tsx                           # Route configuration
```

#### Route Configuration File
```typescript
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import SiteLayout from './layouts/SiteLayout'
import AdminLayout from './layouts/AdminLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, lazy: () => import('./routes/index') },
          { path: 'about', lazy: () => import('./routes/about') },
          { path: 'contact', lazy: () => import('./routes/contact') },
          { path: 'releases', lazy: () => import('./routes/releases') },
          {
            path: 'artists',
            children: [
              { index: true, lazy: () => import('./routes/artists/index') },
              { path: ':slug', lazy: () => import('./routes/artists/$slug') }
            ]
          },
          {
            path: 'blog',
            children: [
              { index: true, lazy: () => import('./routes/blog/index') },
              { path: ':id', lazy: () => import('./routes/blog/$id') }
            ]
          }
        ]
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, lazy: () => import('./routes/admin/index') },
          { path: 'login', lazy: () => import('./routes/admin/login') },
          { path: 'dashboard', lazy: () => import('./routes/admin/dashboard') },
          // ... more admin routes
        ]
      }
    ]
  }
])
```

---

### Phase 3: Layout Migration
**Duration**: 1-2 days  
**Goal**: Convert Next.js layouts to React Router layouts

#### Layout Conversion

1. **Root Layout** (`app/layout.tsx` → `src/layouts/RootLayout.tsx`)
   ```typescript
   import { Outlet } from 'react-router-dom'
   import { ThemeProvider } from '@/components/ThemeProvider'
   
   export default function RootLayout() {
     return (
       <html lang="en">
         <body>
           <ThemeProvider>
             <Outlet />
           </ThemeProvider>
         </body>
       </html>
     )
   }
   ```

2. **Site Layout** (`app/(site)/layout.tsx` → `src/layouts/SiteLayout.tsx`)
   - Keep header, footer, navigation
   - Use `<Outlet />` instead of `{children}`

3. **Admin Layout** (`app/admin/layout.tsx` → `src/layouts/AdminLayout.tsx`)
   - Keep admin sidebar, header
   - Add authentication check
   - Use `<Outlet />` for nested routes

4. **Portal Layout** (`app/admin/portal/layout.tsx` → `src/layouts/PortalLayout.tsx`)
   - Keep portal-specific UI
   - Nest under AdminLayout

---

### Phase 4: Component Migration
**Duration**: 2-3 days  
**Goal**: Update components to work with React Router

#### Migration Checklist

1. **Navigation Components**
   - Replace Next.js `<Link>` with React Router `<Link>`
   ```typescript
   // Before (Next.js)
   import Link from 'next/link'
   <Link href="/about">About</Link>
   
   // After (React Router)
   import { Link } from 'react-router-dom'
   <Link to="/about">About</Link>
   ```

2. **Image Components**
   - Replace `next/image` with standard `<img>` or custom lazy loader
   ```typescript
   // Before (Next.js)
   import Image from 'next/image'
   <Image src="/logo.png" width={100} height={100} alt="Logo" />
   
   // After (React Router)
   <img src="/logo.png" width={100} height={100} alt="Logo" loading="lazy" />
   ```

3. **Metadata/SEO**
   - Replace Next.js `metadata` with `react-helmet-async` or custom solution
   ```bash
   npm install react-helmet-async
   ```
   ```typescript
   // Before (Next.js)
   export const metadata = {
     title: 'About - SoundGang',
     description: '...'
   }
   
   // After (React Router)
   import { Helmet } from 'react-helmet-async'
   
   export default function About() {
     return (
       <>
         <Helmet>
           <title>About - SoundGang</title>
           <meta name="description" content="..." />
         </Helmet>
         {/* component content */}
       </>
     )
   }
   ```

4. **Navigation Hooks**
   ```typescript
   // Before (Next.js)
   import { useRouter, usePathname, useSearchParams } from 'next/navigation'
   
   // After (React Router)
   import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
   ```

5. **Theme Provider**
   - Replace `next-themes` with custom theme provider
   ```typescript
   // src/providers/ThemeProvider.tsx
   import { createContext, useContext, useEffect, useState } from 'react'
   
   type Theme = 'light' | 'dark'
   
   const ThemeContext = createContext<{
     theme: Theme
     setTheme: (theme: Theme) => void
   }>({ theme: 'dark', setTheme: () => {} })
   
   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<Theme>('dark')
     
     useEffect(() => {
       const saved = localStorage.getItem('theme') as Theme
       if (saved) setTheme(saved)
     }, [])
     
     useEffect(() => {
       localStorage.setItem('theme', theme)
       document.documentElement.classList.toggle('dark', theme === 'dark')
     }, [theme])
     
     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     )
   }
   
   export const useTheme = () => useContext(ThemeContext)
   ```

6. **Copy All Components**
   ```bash
   # Copy components directory
   cp -r app/components src/components
   
   # Update all import paths
   # Change: import X from '@/components/...'
   # To: import X from '@/components/...' (should work with tsconfig paths)
   ```

---

### Phase 5: Data Fetching Migration
**Duration**: 2-3 days  
**Goal**: Migrate from Next.js data fetching to client-side/loader patterns

#### Data Fetching Patterns

1. **Server Components → Loaders**
   ```typescript
   // Before (Next.js Server Component)
   async function ArtistsPage() {
     const artists = await fetch('https://api.soundgang.ng/artists').then(r => r.json())
     return <div>{artists.map(...)}</div>
   }
   
   // After (React Router Loader)
   // src/routes/artists/index.tsx
   import { useLoaderData } from 'react-router-dom'
   
   export async function loader() {
     const artists = await fetch('https://api.soundgang.ng/artists').then(r => r.json())
     return { artists }
   }
   
   export default function ArtistsPage() {
     const { artists } = useLoaderData<typeof loader>()
     return <div>{artists.map(...)}</div>
   }
   ```

2. **Client Components → React Query**
   ```bash
   npm install @tanstack/react-query
   ```
   ```typescript
   // src/main.tsx
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
   
   const queryClient = new QueryClient()
   
   <QueryClientProvider client={queryClient}>
     <RouterProvider router={router} />
   </QueryClientProvider>
   ```

3. **API Integration**
   - Update API base URL in `lib/api.ts`
   - Use existing `/api` backend (Cloudflare Worker)
   - Add CORS configuration if needed

4. **Caching Strategy**
   - Use React Query for client-side caching
   - Use loader cache for route-level caching
   - Implement stale-while-revalidate pattern

---

### Phase 6: Routing Features
**Duration**: 1-2 days  
**Goal**: Implement advanced routing features

#### Features to Implement

1. **Authentication Guards**
   ```typescript
   // src/utils/auth.tsx
   import { redirect } from 'react-router-dom'
   
   export async function requireAuth() {
     const token = localStorage.getItem('token')
     if (!token) {
       throw redirect('/admin/login')
     }
     return { token }
   }
   
   // In route config
   {
     path: 'admin/dashboard',
     loader: requireAuth,
     lazy: () => import('./routes/admin/dashboard')
   }
   ```

2. **Loading States**
   ```typescript
   // src/components/LoadingFallback.tsx
   export function LoadingFallback() {
     return <div>Loading...</div>
   }
   
   // In router
   <Suspense fallback={<LoadingFallback />}>
     <RouterProvider router={router} />
   </Suspense>
   ```

3. **Error Boundaries**
   ```typescript
   // src/components/ErrorBoundary.tsx
   import { useRouteError } from 'react-router-dom'
   
   export function ErrorBoundary() {
     const error = useRouteError()
     return <div>Error: {error.message}</div>
   }
   
   // In route config
   {
     path: '/',
     errorElement: <ErrorBoundary />,
     children: [...]
   }
   ```

4. **404 Page**
   ```typescript
   // src/routes/404.tsx
   export default function NotFound() {
     return <div>404 - Page Not Found</div>
   }
   
   // In router
   {
     path: '*',
     element: <NotFound />
   }
   ```

5. **Redirects**
   ```typescript
   // Old URL redirects
   {
     path: '/old-path',
     loader: () => redirect('/new-path')
   }
   ```

---

### Phase 7: Build & Deployment
**Duration**: 2-3 days  
**Goal**: Configure build and Cloudflare Workers deployment

#### Build Configuration

1. **Vite Build**
   ```json
   // package.json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "deploy": "npm run build && wrangler pages deploy dist"
     }
   }
   ```

2. **Cloudflare Pages Configuration**
   ```toml
   # wrangler.toml
   name = "soundgang-app"
   compatibility_date = "2024-01-01"
   
   [site]
   bucket = "./dist"
   
   [[routes]]
   pattern = "/*"
   ```

3. **SPA Routing on Cloudflare**
   ```javascript
   // public/_redirects (for Cloudflare Pages)
   /*    /index.html   200
   ```
   
   OR
   
   ```javascript
   // functions/_middleware.ts (for advanced routing)
   export async function onRequest(context) {
     const url = new URL(context.request.url)
     if (!url.pathname.includes('.')) {
       return context.env.ASSETS.fetch('/index.html')
     }
     return context.next()
   }
   ```

4. **Environment Variables**
   ```bash
   # .env
   VITE_API_URL=https://api.soundgang.ng
   VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```
   
   ```typescript
   // Access in code
   const apiUrl = import.meta.env.VITE_API_URL
   ```

5. **Asset Optimization**
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'editor': ['@editorjs/editorjs'],
             'vendor': ['react', 'react-dom', 'react-router-dom']
           }
         }
       }
     }
   })
   ```

---

### Phase 8: Testing & Validation
**Duration**: 2-3 days  
**Goal**: Ensure everything works correctly

#### Testing Checklist

- [ ] All public routes load correctly
- [ ] All admin routes load correctly
- [ ] Dynamic routes work (`:slug`, `:id`)
- [ ] Navigation between pages works
- [ ] Authentication flow works
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Theme switching works
- [ ] Mobile responsive design intact
- [ ] Editor.js functionality works
- [ ] API calls succeed
- [ ] Loading states display
- [ ] Error boundaries catch errors
- [ ] 404 page shows for invalid routes
- [ ] SEO meta tags render
- [ ] Performance metrics acceptable (Lighthouse)

#### Testing Tools
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright # for E2E tests
```

---

### Phase 9: Optimization
**Duration**: 1-2 days  
**Goal**: Optimize performance and bundle size

#### Optimization Tasks

1. **Code Splitting**
   - Lazy load routes
   - Lazy load heavy components (Editor.js)
   - Split vendor bundles

2. **Bundle Analysis**
   ```bash
   npm install -D rollup-plugin-visualizer
   ```
   ```typescript
   // vite.config.ts
   import { visualizer } from 'rollup-plugin-visualizer'
   
   export default defineConfig({
     plugins: [visualizer()]
   })
   ```

3. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Add proper sizing

4. **Caching Strategy**
   - Configure React Query cache times
   - Set up service worker (optional)
   - Use Cloudflare CDN caching

5. **Performance Monitoring**
   - Add Web Vitals tracking
   - Set up error monitoring (Sentry)
   - Configure analytics

---

## 📋 Detailed Migration Steps

### Step-by-Step Execution

#### Week 1: Setup & Foundation

**Day 1-2: Project Initialization**
1. Create new React Router project
2. Install all dependencies
3. Configure Vite, TypeScript, Tailwind
4. Set up directory structure
5. Copy `public/` assets
6. Copy `globals.css`

**Day 3-4: Core Routes**
1. Create root layout
2. Migrate home page
3. Migrate about, contact pages
4. Migrate artists pages
5. Test routing works

**Day 5: Public Routes Completion**
1. Migrate blog routes
2. Migrate releases page
3. Implement loaders for data fetching
4. Test all public routes

#### Week 2: Admin Section

**Day 6-7: Admin Layout & Auth**
1. Create admin layout
2. Implement authentication
3. Create login page
4. Add auth guards
5. Migrate dashboard

**Day 8-9: Admin CRUD Pages**
1. Migrate artists admin pages
2. Migrate blog admin pages
3. Migrate releases admin pages
4. Migrate tracks, videos, events pages

**Day 10: Portal & Remaining Admin**
1. Migrate portal layout
2. Migrate portal routes
3. Migrate media, player, profile pages
4. Test all admin functionality

#### Week 3: Components & Polish

**Day 11-12: Component Migration**
1. Copy all components
2. Update imports (Link, Image, etc.)
3. Fix TypeScript errors
4. Test components individually

**Day 13: Data & API Integration**
1. Set up React Query
2. Update API client
3. Test all API calls
4. Implement error handling

**Day 14: SEO & Metadata**
1. Install react-helmet-async
2. Add meta tags to all pages
3. Create sitemap generator
4. Add robots.txt

#### Week 4: Deployment & Testing

**Day 15-16: Build & Deploy**
1. Configure Vite build
2. Set up Cloudflare Pages
3. Deploy to staging
4. Test on live environment

**Day 17-18: Testing**
1. Manual testing all routes
2. Test on mobile devices
3. Cross-browser testing
4. Performance testing

**Day 19: Optimization**
1. Analyze bundle size
2. Optimize images
3. Configure caching
4. Run Lighthouse audits

**Day 20: Launch**
1. Final testing
2. Deploy to production
3. Monitor for errors
4. Update documentation

---

## 🚨 Key Differences & Gotchas

### Next.js vs React Router

| Feature | Next.js | React Router |
|---------|---------|--------------|
| **Routing** | File-based | Config-based |
| **Data Fetching** | Server Components, `fetch` | Loaders, React Query |
| **Navigation** | `next/link`, `next/navigation` | `react-router-dom` |
| **Layouts** | `layout.tsx` with `{children}` | Layout component with `<Outlet />` |
| **Images** | `next/image` | `<img>` or custom loader |
| **Metadata** | `export const metadata` | `react-helmet-async` |
| **API Routes** | `app/api/` | Separate backend (already exists) |
| **Environment** | `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` |
| **Build Tool** | Next.js Turbopack | Vite |
| **Deployment** | OpenNext for CF Workers | Cloudflare Pages |

### Common Issues

1. **Import Paths**
   - Update all `next/*` imports
   - Check `@/` path alias configuration

2. **Dynamic Routes**
   - `[slug]` → `:slug` in route config
   - `[...slug]` → `*` for catch-all

3. **Server vs Client**
   - No server components in React Router
   - Use loaders for initial data
   - Use React Query for client data

4. **Middleware**
   - Next.js middleware → React Router loaders
   - Authentication checks in loaders

5. **Environment Variables**
   - Prefix with `VITE_` for client-side
   - Access via `import.meta.env`

---

## 📦 Package.json Scripts

```json
{
  "name": "soundgang-app",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "deploy:staging": "npm run build && wrangler pages deploy dist --branch=staging",
    "deploy:production": "npm run build && wrangler pages deploy dist --branch=main"
  }
}
```

---

## ✅ Migration Checklist

### Pre-Migration
- [ ] Audit current codebase
- [ ] Document custom logic
- [ ] Back up current project
- [ ] Set up version control branch
- [ ] Create migration timeline

### Core Migration
- [ ] Initialize new project
- [ ] Install dependencies
- [ ] Configure build tools
- [ ] Migrate layouts
- [ ] Migrate routes (public)
- [ ] Migrate routes (admin)
- [ ] Migrate components
- [ ] Update imports
- [ ] Fix TypeScript errors

### Features
- [ ] Implement authentication
- [ ] Set up data fetching
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Implement theme provider
- [ ] Add SEO/metadata
- [ ] Configure forms
- [ ] Test Editor.js integration

### Deployment
- [ ] Configure Vite build
- [ ] Set up Cloudflare Pages
- [ ] Configure environment variables
- [ ] Test build output
- [ ] Deploy to staging
- [ ] Run tests
- [ ] Performance audit
- [ ] Deploy to production

### Post-Migration
- [ ] Monitor errors
- [ ] Track performance
- [ ] Update documentation
- [ ] Train team on new setup
- [ ] Remove old codebase

---

## 📚 Resources

### Documentation
- [React Router v7 Docs](https://reactrouter.com/en/main)
- [Vite Documentation](https://vitejs.dev/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [React Query Docs](https://tanstack.com/query/latest)

### Migration Guides
- [Next.js to Vite Migration](https://github.com/bluwy/astro-migration-tool)
- [React Router Data Loading](https://reactrouter.com/en/main/route/loader)
- [Cloudflare Pages Framework Guide](https://developers.cloudflare.com/pages/framework-guides/)

### Tools
- [Vite Plugin React](https://github.com/vitejs/vite-plugin-react)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [TanStack Query](https://tanstack.com/query)

---

## 💰 Estimated Effort

| Phase | Days | Developer | Total |
|-------|------|-----------|-------|
| Setup & Config | 2 | 1 | 2 days |
| Route Migration | 5 | 1 | 5 days |
| Layout Migration | 2 | 1 | 2 days |
| Component Migration | 3 | 1 | 3 days |
| Data Fetching | 3 | 1 | 3 days |
| Routing Features | 2 | 1 | 2 days |
| Build & Deploy | 3 | 1 | 3 days |
| Testing | 3 | 1 | 3 days |
| Optimization | 2 | 1 | 2 days |
| **Total** | **25 days** | **1 dev** | **~5 weeks** |

With 2 developers: **~3 weeks**  
With 3 developers: **~2 weeks**

---

## 🎯 Success Criteria

✅ All routes accessible and functional  
✅ Build completes without errors  
✅ Deploys successfully to Cloudflare  
✅ Performance metrics maintained or improved  
✅ SEO intact (meta tags, sitemap)  
✅ Authentication works correctly  
✅ All forms functional  
✅ Mobile responsive  
✅ Cross-browser compatible  
✅ Zero regressions in functionality  

---

## 🚀 Benefits of Migration

1. **Performance**: Vite's fast dev server and optimized builds
2. **Simplicity**: No server/client component complexity
3. **Flexibility**: More control over routing and data fetching
4. **Bundle Size**: Smaller runtime overhead
5. **Developer Experience**: Faster HMR, simpler mental model
6. **Deployment**: Direct Cloudflare Pages integration
7. **Cost**: Potentially lower hosting costs

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | High | Thorough testing, staging environment |
| SEO impact | Medium | Implement proper meta tags, sitemap |
| Performance regression | Medium | Benchmark before/after, optimize |
| Data fetching issues | Medium | Test all API endpoints, add error handling |
| Authentication bugs | High | Extensive testing, fallback to login |
| Missing features | Medium | Feature parity checklist |
| Deployment issues | High | Test on staging first, rollback plan |

---

## 📞 Support & Questions

For questions during migration:
1. Check React Router v7 docs
2. Review Vite configuration guide
3. Consult Cloudflare Pages docs
4. Open GitHub discussions
5. Contact team lead

---

## ✅ ACTUAL MIGRATION RESULTS (May 2026)

### What Was Completed

**✅ All Public Pages (9 routes)**
- Home (`/`) - Full homepage with hero, artists, releases, videos, events
- About (`/about`) - Mission, services, team, values
- Artists (`/artists`) - Grid listing of all artists
- Artist Detail (`/artists/:slug`) - Individual artist pages with releases
- Releases (`/releases`) - Catalog of all releases with filters
- Blog (`/blog`) - Blog posts listing
- Blog Post (`/blog/:id`) - Individual blog post pages
- Contact (`/contact`) - Contact form
- Submit (`/submit`) - Demo submission page

**✅ Core Infrastructure**
- React Router v7 with proper route configuration
- Vite 8.0.10 build system
- Tailwind CSS 4.2.4 with design system
- TypeScript 6.0.3 with proper types
- ESLint configured for React Router exports
- Google Fonts (Poppins) integration
- Theme provider (dark mode support)
- Music player with global state
- API client with Cloudflare Worker integration
- Graceful fallback to static data

**✅ Migration Improvements**
- Removed `react-helmet-async` → Using React Router native `meta` exports
- Removed `next-themes` → Custom ThemeProvider
- Fixed React 19 type imports (ReactNode as type import)
- Proper CSS loading via direct imports
- ESLint configured for React Router route exports

**⏸️ Not Completed (Optional)**
- Admin dashboard (24+ routes)
- Admin authentication flow
- Admin CRUD operations

### Key Architectural Changes

1. **SEO Handling**: `react-helmet-async` → React Router `meta` function
2. **Fonts**: `next/font` → Google Fonts link tags in root
3. **Layouts**: Next.js layouts → React Router layouts with `<Outlet />`
4. **Routing**: File-based routing → `routes.ts` configuration
5. **Environment**: Next.js → Vite + React Router v7

### Performance & Features

- **Dev Server**: http://localhost:5173/ (Vite)
- **Build**: `pnpm build` (optimized production build)
- **API**: Cloudflare Worker at `https://soundgang-api.onochieazukaeme.workers.dev`
- **Deployment**: Ready for Cloudflare Pages
- **TypeScript**: Full type safety maintained
- **SEO**: JSON-LD structured data for rich snippets

### Success Metrics

✅ All public pages functional
✅ API integration working
✅ Responsive design maintained
✅ SEO properly implemented
✅ No build errors or warnings
✅ Hot module replacement working
✅ Theme switching functional
✅ Music player functional

---

**Document Version**: 2.0
**Last Updated**: May 4, 2026
**Author**: Migration Team
**Status**: Public Site Migration Complete ✅
