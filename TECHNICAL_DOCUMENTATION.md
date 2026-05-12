# PaulAccesso - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Development Guide](#development-guide)
7. [Core Features](#core-features)
8. [Component Architecture](#component-architecture)
9. [State Management](#state-management)
10. [API Integration](#api-integration)
11. [Styling & Theme](#styling--theme)
12. [Build & Deployment](#build--deployment)
13. [Development Workflow](#development-workflow)

---

## Project Overview

**Project Name:** PaulAccesso  
**Description:** A comprehensive visitor management and access control system designed to streamline visitor registration, tracking, and authentication.  
**Purpose:** Enable secure visitor management through digital registration, camera capture, ID verification, and real-time tracking with role-based access control.

### Key Capabilities

- **Visitor Registration**: Capture visitor information with photo and ID proof
- **Visitor Tracking**: Log visitor check-ins and check-outs
- **Dashboard Analytics**: Real-time statistics and visitor insights
- **User Management**: Admin panel for managing system users
- **Authentication**: Secure token-based authentication system
- **Dark Mode**: Switchable UI theme for accessibility
- **PDF Generation**: Export visitor logs and reports

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│         React Application (Vite)            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │      UI Components (Radix UI)         │ │
│  │  - Dashboard, Forms, Tables, Cards    │ │
│  └───────────────────────────────────────┘ │
│                   ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │   AppContext (State Management)       │ │
│  │  - Auth, Visitors, Users, Theme       │ │
│  └───────────────────────────────────────┘ │
│                   ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │    React Router (Routing)             │ │
│  │  - Dashboard, Register, Log, Admin    │ │
│  └───────────────────────────────────────┘ │
│                   ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │      API Client (Fetch/Axios)         │ │
│  └───────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│         Backend API (REST)                  │
│  Base URL: https://paulaccesso.paulmerchants.net/api
│  or http://localhost:8598/api (dev)        │
└─────────────────────────────────────────────┘
```

### Application Flow

```
User Accesses App
       ↓
Authentication Check (AppContext)
       ↓
   ┌───┴───┐
   │ Token │
   │ Valid?│
   └───┬───┘
       ├─ No  → Login Page (if implemented)
       ├─ Yes → Check User Role
            ├─ ADMIN  → All Features Unlocked
            ├─ USER   → Dashboard, Register, Log
            └─ GUEST  → Limited Access
```

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | Latest | UI Library & Component Framework |
| **Vite** | Latest | Build tool & dev server |
| **React Router** | v7+ | Client-side routing |
| **Tailwind CSS** | Latest | Utility-first CSS framework |
| **Radix UI** | v1.x | Unstyled, accessible components |
| **Material-UI Icons** | v7.3.5 | Icon library |
| **Lucide Icons** | Latest | Additional icon set |
| **jsPDF** | v4.2.1 | PDF generation |
| **jsPDF AutoTable** | v5.0.7 | PDF table formatting |
| **Canvas Confetti** | v1.9.4 | Celebration animations |
| **Date-fns** | v3.6.0 | Date utilities |
| **cmdk** | v1.1.1 | Command palette component |
| **embla-carousel** | v8.6.0 | Carousel component |

### Development Stack

| Tool | Purpose |
|------|---------|
| **PostCSS** | CSS transformation |
| **Tailwind CSS (via Vite plugin)** | CSS framework integration |
| **Vite Plugins** | React, Tailwind CSS support |
| **npm** | Package manager |

### Backend Integration

- **API Base**: `https://paulaccesso.paulmerchants.net/api` (production)
- **Auth Method**: Bearer Token (JWT)
- **API Format**: REST with JSON

---

## Project Structure

```
paulaccesso/
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
│
├── public/                    # Static assets
│
├── src/
│   ├── main.jsx               # React root entry point
│   │
│   ├── app/
│   │   ├── App.jsx            # Root component with providers
│   │   ├── routes.jsx         # Route definitions
│   │   │
│   │   └── components/
│   │       ├── RootLayout.jsx             # Main layout wrapper
│   │       ├── Dashboard.jsx              # Dashboard page
│   │       ├── VisitorRegistration.jsx    # Registration form
│   │       ├── VisitorLog.jsx             # Visitor history log
│   │       ├── CameraCapture.jsx          # Camera capture component
│   │       ├── ErrorBoundary.jsx          # Error handling
│   │       ├── ProtectedRoute.jsx         # Route protection HOC
│   │       │
│   │       ├── admin/
│   │       │   └── UserManagement.jsx     # Admin user panel
│   │       │
│   │       ├── context/
│   │       │   └── AppContext.jsx         # Global app state
│   │       │
│   │       ├── figma/
│   │       │   └── ImageWithFallback.jsx  # Image component with fallback
│   │       │
│   │       └── layout/
│   │           └── SettingsDrawer.jsx     # Settings panel
│   │
│   ├── ui/                    # Radix UI component library
│   │   ├── accordion.jsx
│   │   ├── alert.jsx
│   │   ├── alert-dialog.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── checkbox.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── table.jsx
│   │   ├── tabs.jsx
│   │   ├── textarea.jsx
│   │   ├── toast.jsx
│   │   ├── tooltip.jsx
│   │   ├── utils.js           # UI utilities & cn() helper
│   │   └── use-mobile.js      # Mobile detection hook
│   │
│   └── styles/
│       ├── index.css          # Global styles
│       ├── theme.css          # Theme variables
│       ├── tailwind.css       # Tailwind imports
│       └── fonts.css          # Font definitions
│
├── TECHNICAL_DOCUMENTATION.md # This file
├── README.md                  # Project overview
└── ATTRIBUTIONS.md            # Third-party attributions
```

---

## Setup & Installation

### Prerequisites

- **Node.js**: v16+ (v18+ recommended)
- **npm**: v7+ or **yarn**: v1.22+
- **Git**: For version control

### Installation Steps

1. **Clone the Repository**
```bash
cd /Users/kuber/Projects/paulaccesso
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
   - API Base URL is configured in [AppContext.jsx](src/app/components/context/AppContext.jsx#L16)
   - Production: `https://paulaccesso.paulmerchants.net/api`
   - Development: `http://localhost:8598/api`
   - Toggle between by commenting/uncommenting in AppContext

4. **Start Development Server**
```bash
npm run dev
```
   - Server runs on `http://localhost:5173` (default Vite port)
   - Hot module replacement (HMR) enabled for live reload

5. **Build for Production**
```bash
npm run build
```
   - Outputs optimized build to `dist/` directory

---

## Development Guide

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

### File Organization Best Practices

1. **Components**: One component per file, use PascalCase
2. **Utilities**: Extract reusable logic into separate files
3. **Styles**: Use Tailwind classes, create `styles/` directory for global CSS
4. **Constants**: Define constants at the top of files or in separate files
5. **Types/Props**: Document component props with comments

### Component Development Pattern

```jsx
import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Button } from './ui/button';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title prop
 */
export function MyComponent({ title }) {
  const { someContextValue } = useApp();
  const [state, setState] = useState('');

  const handleAction = () => {
    // Action logic
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={handleAction}>Action</Button>
    </div>
  );
}
```

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Lint code (if configured)
npm run format    # Format code (if configured)
```

---

## Core Features

### 1. Visitor Registration

**File**: [VisitorRegistration.jsx](src/app/components/VisitorRegistration.jsx)

**Functionality**:
- Capture visitor personal information
- Camera-based photo capture
- ID proof documentation
- Employee selection
- Purpose of visit tracking
- Form validation

**Data Model**:
```javascript
{
  name: string,                    // Visitor name
  mobile: string,                  // Phone number
  email: string,                   // Email address
  company: string,                 // Company name
  address: string,                 // Visitor address
  personToMeetEmpId: string,       // Employee ID to meet
  purpose: string,                 // Visit purpose
  otherPurpose: string,            // Custom purpose (if "Other")
  idType: string,                  // ID type (Passport, Aadhar, etc.)
  idNumber: string,                // ID number
  capturedImage: base64,           // Visitor photo
  capturedIdProof: base64          // ID proof photo
}
```

### 2. Dashboard

**File**: [Dashboard.jsx](src/app/components/Dashboard.jsx)

**Displays**:
- Today's visitor count
- Currently active visitors
- Checked-out count
- Recent visitors list
- Quick action buttons

**Statistics Calculation**:
- Uses `getStats()` from AppContext
- Filters by date and check-in/out status

### 3. Visitor Logging & Tracking

**File**: [VisitorLog.jsx](src/app/components/VisitorLog.jsx)

**Features**:
- View all registered visitors
- Search/filter capabilities
- Check-in/Check-out status tracking
- PDF export functionality
- Sortable columns
- Date range filtering

### 4. Camera Capture Module

**File**: [CameraCapture.jsx](src/app/components/CameraCapture.jsx)

**Capabilities**:
- Access device camera
- Capture high-quality images
- Preview before confirmation
- Fallback to file upload
- Error handling for camera access denial

### 5. User Management (Admin)

**File**: [admin/UserManagement.jsx](src/app/components/admin/UserManagement.jsx)

**Admin Features** (available when `user.role === 'ADMIN'`):
- View all system users
- Create new users
- Edit user information
- Delete users
- Assign roles and permissions

### 6. Authentication & Authorization

**Implementation**: [AppContext.jsx](src/app/components/context/AppContext.jsx) + [ProtectedRoute.jsx](src/app/components/ProtectedRoute.jsx)

**Flow**:
```
1. User logs in with credentials
2. Backend returns JWT token + user data
3. Token stored in localStorage
4. Token sent in Authorization header for all API requests
5. ProtectedRoute validates token before rendering
6. Token expiration triggers re-authentication
```

**Role-Based Access**:
```javascript
- ADMIN: Full system access
- USER: Registration, logging, viewing features
- GUEST: Limited read-only access
```

---

## Component Architecture

### UI Component Library Structure

All UI components are from **Radix UI** with Tailwind CSS styling. Located in [src/app/components/ui/](src/app/components/ui/)

#### Common Patterns

**Modal/Dialog**:
```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Form Components**:
```jsx
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

<div className="space-y-4">
  <Label htmlFor="name">Name</Label>
  <Input 
    id="name" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
  />
</div>
```

**Tables**:
```jsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.value1}</TableCell>
        <TableCell>{row.value2}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Cards**:
```jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

---

## State Management

### AppContext Architecture

**File**: [AppContext.jsx](src/app/components/context/AppContext.jsx)

### State Structure

```javascript
{
  // Authentication
  token: string | null,              // JWT token
  user: object | null,               // Current user object
  isAuthInitialized: boolean,        // Auth check complete

  // Data
  visitors: array,                   // All registered visitors
  users: array,                       // System users (admin only)
  employees: array,                  // Employee list for assignments
  notifications: array,               // System notifications

  // UI State
  darkMode: boolean,                  // Theme toggle
  loading: boolean,                   // Loading indicator
  availableTags: array                // Visitor tags/categories
}
```

### Using AppContext

```jsx
import { useApp } from './context/AppContext';

function MyComponent() {
  const {
    token,
    user,
    visitors,
    darkMode,
    setDarkMode,
    // ... other methods
  } = useApp();

  // Use context values and methods
}
```

### Key Methods in AppContext

| Method | Purpose |
|--------|---------|
| `useApp()` | Hook to access context |
| `registerVisitor(data)` | Register new visitor |
| `fetchVisitors()` | Get all visitors |
| `fetchEmployees()` | Get employee list |
| `fetchUsers()` | Get system users (admin) |
| `logout()` | Clear auth and redirect |
| `getStats()` | Calculate dashboard stats |
| `updateUserRole(id, role)` | Change user role |

### LocalStorage Usage

```javascript
// Persisted in localStorage
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));
localStorage.setItem("darkMode", JSON.stringify(darkMode));

// Restored on app load
const savedToken = localStorage.getItem("token");
const savedUser = JSON.parse(localStorage.getItem("user"));
```

---

## API Integration

### Base Configuration

```javascript
const API_BASE = "https://paulaccesso.paulmerchants.net/api";
// Development: "http://localhost:8598/api"
```

### Authentication Headers

All API requests include:
```javascript
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

### Common Endpoints

#### Authentication
```
POST /auth/login
  Request: { email, password }
  Response: { token, user }

GET /users/me
  Headers: { Authorization: Bearer token }
  Response: { user data }
```

#### Visitors
```
POST /visitors/register
  Body: { visitor data }
  Response: { visitor object }

GET /visitors
  Query: ?status=active&date=YYYY-MM-DD
  Response: [visitor array]

PUT /visitors/{id}
  Body: { updated fields }
  Response: { updated visitor }

POST /visitors/{id}/checkout
  Response: { checkout confirmation }
```

#### Users (Admin)
```
GET /users
  Response: [users array]

POST /users
  Body: { user data }
  Response: { created user }

PUT /users/{id}
  Body: { updated fields }
  Response: { updated user }

DELETE /users/{id}
  Response: { deletion confirmation }
```

#### Employees
```
GET /employees
  Response: [employees array]

GET /employees/{id}
  Response: { employee object }
```

### API Error Handling Pattern

```javascript
try {
  const response = await fetch(`${API_BASE}/endpoint`, {
    method: 'GET|POST|PUT|DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - clear auth
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
    }
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw error;
}
```

---

## Styling & Theme

### Tailwind CSS Configuration

**File**: [tailwind.config.js](tailwind.config.js)

**Features**:
- Customizable color palette
- Dark mode support
- Responsive breakpoints
- Extended spacing and sizing

### CSS Organization

| File | Purpose |
|------|---------|
| [styles/index.css](src/styles/index.css) | Global resets and utilities |
| [styles/tailwind.css](src/styles/tailwind.css) | Tailwind directives |
| [styles/theme.css](src/styles/theme.css) | CSS custom properties (variables) |
| [styles/fonts.css](src/styles/fonts.css) | Font imports and definitions |

### Dark Mode Implementation

```javascript
// In AppContext
const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved ? JSON.parse(saved) : false;
});

useEffect(() => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);
```

### Theming Classes

```jsx
// Light mode (default)
<div className="text-gray-900 bg-white">

// Dark mode compatible
<div className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-950">

// Toggle via context
const { darkMode, setDarkMode } = useApp();
<button onClick={() => setDarkMode(!darkMode)}>
  Toggle Theme
</button>
```

### Color Palette

**Primary Colors**:
- Blue: Used for primary actions and highlights
- Green: Used for success states
- Red: Used for errors and warnings
- Gray: Used for neutral elements

**CSS Variables** (in [theme.css](src/styles/theme.css)):
```css
:root {
  --primary: #2563eb;    /* Blue */
  --success: #16a34a;    /* Green */
  --error: #dc2626;      /* Red */
  --warning: #f59e0b;    /* Amber */
}
```

---

## Build & Deployment

### Build Process

```bash
npm run build
```

**Output**:
- Optimized bundle in `dist/` directory
- Tree-shaking of unused code
- Code splitting for route-based chunks
- CSS minification
- Asset compression

### Build Configuration

**File**: [vite.config.js](vite.config.js)

```javascript
export default defineConfig({
  base: "/",  // Base URL for deployment
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

### Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Server**
   - Upload `dist/` folder to web server
   - Configure server to serve `index.html` for all routes (SPA routing)

3. **Environment Configuration**
   - Update API_BASE in AppContext to production endpoint
   - Ensure CORS is properly configured
   - Set secure cookie policies if needed

### Deployment Checklist

- [ ] Update API_BASE URL to production
- [ ] Enable HTTPS
- [ ] Configure CORS headers
- [ ] Set up security headers (CSP, X-Frame-Options, etc.)
- [ ] Configure error logging/monitoring
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Test authentication flow in production
- [ ] Verify camera/media permissions in production
- [ ] Test PDF export functionality

---

## Development Workflow

### Git Workflow (Recommended)

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
npm run dev

# Test changes
npm run build

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/feature-name

# Create pull request for review
```

### Common Development Tasks

### Adding a New Page/Route

1. **Create Component**:
   ```jsx
   // src/app/components/NewPage.jsx
   export function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Add Route**:
   ```jsx
   // In src/app/routes.jsx
   {
     path: "new-route",
     element: (
       <ProtectedRoute>
         <NewPage />
       </ProtectedRoute>
     )
   }
   ```

3. **Add Navigation**:
   Update navigation links in [RootLayout.jsx](src/app/components/RootLayout.jsx)

### Adding a New UI Component

1. **Create Component File**:
   ```jsx
   // src/app/components/ui/new-component.jsx
   import * as React from "react"
   
   const NewComponent = React.forwardRef(({ className, ...props }, ref) => (
     <div ref={ref} className={className} {...props} />
   ))
   NewComponent.displayName = "NewComponent"
   
   export { NewComponent }
   ```

2. **Export from Index** (if index exists):
   ```jsx
   export { NewComponent } from "./new-component"
   ```

3. **Use in Components**:
   ```jsx
   import { NewComponent } from "./ui/new-component"
   ```

### Modifying API Calls

1. **Update AppContext** with new methods
2. **Add error handling** for new endpoints
3. **Update localStorage** if persistent data needed
4. **Test with dev and prod** API endpoints

### Debugging Tips

```javascript
// Enable verbose logging
console.log('State:', { token, user, visitors });

// Check API responses
fetch(url).then(r => r.json()).then(console.log);

// Inspect localStorage
console.log(localStorage);

// React DevTools
// Install React DevTools browser extension for component inspection
```

---

## Troubleshooting

### Common Issues

#### Issue: "Token is invalid"
- **Cause**: Token expired or corrupted
- **Solution**: Clear localStorage and re-authenticate
  ```javascript
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Reload page
  ```

#### Issue: "Camera not working"
- **Cause**: Browser permissions denied or HTTPS required
- **Solution**: 
  - Grant camera permission when prompted
  - Use HTTPS in production (camera requires secure context)
  - Check browser console for specific errors

#### Issue: "API calls failing with 401"
- **Cause**: Token expired or not sent
- **Solution**:
  - Verify token in localStorage
  - Check Authorization header format
  - Re-authenticate if token expired

#### Issue: "Build fails"
- **Cause**: Missing dependencies or syntax errors
- **Solution**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run build
  ```

#### Issue: "Dark mode not persisting"
- **Cause**: localStorage blocked or cleared
- **Solution**:
  - Check browser privacy settings
  - Verify localStorage not disabled
  - Check AppContext dark mode effect

---

## Performance Optimization

### Current Optimizations

- **Code Splitting**: Route-based chunking via React Router
- **Tree Shaking**: Unused code removed during build
- **Asset Compression**: Images and fonts optimized
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Prevents unnecessary re-renders (use React.memo when needed)

### Recommendations for Enhancement

```javascript
// Use useMemo for expensive calculations
const stats = useMemo(() => calculateStats(visitors), [visitors]);

// Use useCallback for event handlers in lists
const handleClick = useCallback((id) => {
  // Handler logic
}, [dependencies]);

// Lazy load routes
const AdminPage = lazy(() => import('./components/admin/AdminPage'));
```

---

## Security Considerations

### Authentication Security

- [ ] Tokens stored in localStorage (consider httpOnly cookies in future)
- [ ] Authorization headers sent for all API requests
- [ ] Token validation on app startup
- [ ] 401 Responses trigger re-authentication

### Data Security

- [ ] Sensitive data not logged to console in production
- [ ] API errors sanitized (no stack traces sent to frontend)
- [ ] Image data handled carefully (base64 in memory only)
- [ ] HTTPS required for production

### Content Security

- [ ] Input validation on forms
- [ ] XSS protection via React's auto-escaping
- [ ] CSRF tokens (handled by backend)
- [ ] No hardcoded credentials

### Recommendations

- Implement CSRF token handling
- Use environment variables for API URLs
- Add rate limiting for API calls
- Implement session timeout
- Add audit logging for admin actions

---

## Contributing Guidelines

### Code Standards

- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Add JSDoc comments for complex functions
- Keep components focused and modular
- Maximum 300 lines per component file
- Extract reusable logic into hooks or utilities

### Testing Recommendations

- Test components in isolation
- Verify API integrations work with backend
- Test dark mode compatibility
- Test responsive design on mobile
- Verify camera permissions flow

---

## References & Resources

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Radix UI**: https://www.radix-ui.com
- **React Router**: https://reactrouter.com
- **jsPDF Documentation**: https://github.com/parallax/jsPDF

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-11 | Initial technical documentation |

---

## Contact & Support

For technical questions or issues, refer to the project repository or contact the development team.

**Last Updated**: May 11, 2026  
**Maintained By**: Development Team
