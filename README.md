# Team Task Manager

A production-ready, beautiful, and secure Team Task Manager web application built from scratch. Features a premium glassmorphic dark-theme UI with micro-animations, comprehensive project dashboards, multi-user membership management, and a flexible task tracking board.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL under the hood) via `@supabase/supabase-js` SDK
- **Authentication**: JWT Bearer tokens + bcryptjs password hashing
- **Frontend**: React.js (Vite) + Tailwind CSS v3 + Radix UI Primitives (shadcn-style)
- **Deployment Ready**: Railway (separated configurations for frontend and backend, Procfile configured)

---

## Project Structure

```text
/team-task-manager
  /backend
    /src
      /config
        supabase.js        # Supabase Client initialisation
      /controllers
        authController.js  # Register / Login authentication
        dashboardController.js # Aggregated statistics calculations
        projectController.js # CRUD for projects & member management
        taskController.js  # CRUD and status updates for tasks
      /middlewares
        authMiddleware.js  # Authentication token check
        roleMiddleware.js  # Project Role Check (ADMIN vs MEMBER)
        errorHandler.js    # Global centralized error Handler
      /routes
        authRoutes.js
        dashboardRoutes.js
        projectRoutes.js
        taskRoutes.js
      /utils
        response.js        # Normalized Success/Error response builders
        validate.js        # Zod request body validation parser
    server.js              # Application entry point
    Procfile               # Production execution rules
    .env.example
  /frontend
    /src
      /api
        axiosInstance.js   # HTTP interceptors (JWT attachment, auto-logout on 401)
      /components
        /layout
          Header.jsx       # Global responsive header
          Layout.jsx       # Top-level application layout
          ProtectedRoute.jsx # Navigation gate checking authentication
          Sidebar.jsx      # Navigation drawer
        /ui                # Custom Radix-UI components
          Avatar.jsx, Badge.jsx, Button.jsx, Card.jsx, Dialog.jsx,
          DropdownMenu.jsx, Input.jsx, Label.jsx, Select.jsx,
          Separator.jsx, Skeleton.jsx, Tabs.jsx
      /context
        AuthContext.jsx    # React Authentication state provider
      /hooks
        useAuth.js         # Authentication state consumer
      /pages
        DashboardPage.jsx  # Aggregated statistics and task tracking lists
        LoginPage.jsx      # Animated entry card for login
        ProjectDetailPage.jsx # Kanban boards & table view with member grids
        ProjectSettingsPage.jsx # Project details modification and user invitation
        ProjectsPage.jsx   # Project grids and creation forms
        RegisterPage.jsx   # Signup layout
      App.jsx              # Routing configurations
      index.css            # Base Tailwind and glassmorphic designs
      main.jsx             # React DOM loader
    index.html             # Google fonts and meta definitions
    vite.config.js         # Port configuration definitions
    .env.example
  README.md
```

---

## Database Schema (PostgreSQL)

The application uses the following tables under Supabase. The SQL file is located in `backend/supabase/schema.sql`.

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MEMBER')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members (Join Table)
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MEMBER')),
  UNIQUE(project_id, user_id)
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  due_date TIMESTAMPTZ,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Configuration & Environment Setup

### 1. Backend `.env`

Create a `.env` file in the `/backend` folder:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> [!WARNING]
> Always keep your `SUPABASE_SERVICE_ROLE_KEY` secret. The backend utilizes it to secure read/write operations and bypass RLS constraints securely on the server side.

### 2. Frontend `.env`

Create a `.env` file in the `/frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Step-by-Step Installation

1. **Clone and Navigate**:
   ```bash
   cd team-task-manager
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Configure your .env file
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Configure your .env file
   npm run dev
   ```

4. **Verify Application**:
   - Access the frontend dashboard at `http://localhost:5173`
   - APIs will be accessible locally at `http://localhost:5000/api`

---

## Build and Production Deployment

### Frontend Build
To bundle the React client:
```bash
cd frontend
npm run build
```
This builds static assets into the `frontend/dist` directory.

### Railway Deployment
1. Configure two services on Railway: One for the backend and one for the frontend.
2. In the backend service, set environmental variables matching the backend `.env`. The `Procfile` at the root of `backend/` tells Railway to execute `node server.js`.
3. In the frontend service, set the `VITE_API_URL` pointing to the public URL of the deployed backend service.
