import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireProjectRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../utils/validate.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from '../controllers/taskController.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// ── Project-scoped task routes ──────────────────────────────────────

// GET  /api/projects/:id/tasks  – list tasks for a project (member+)
router.get('/projects/:id/tasks', requireProjectRole('MEMBER'), getTasks);

// POST /api/projects/:id/tasks  – create task in a project (admin only)
router.post('/projects/:id/tasks', requireProjectRole('ADMIN'), validate(createTaskSchema), createTask);

// ── Task-level routes (permissions checked inside controller) ───────

// PUT    /api/tasks/:id         – update task
router.put('/tasks/:id', validate(updateTaskSchema), updateTask);

// DELETE /api/tasks/:id         – delete task
router.delete('/tasks/:id', deleteTask);

// PATCH  /api/tasks/:id/status  – update task status only
router.patch('/tasks/:id/status', validate(updateTaskStatusSchema), updateTaskStatus);

export default router;
