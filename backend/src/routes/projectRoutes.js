import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireProjectRole } from '../middlewares/roleMiddleware.js';
import { validate } from '../utils/validate.js';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from '../controllers/projectController.js';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET    /api/projects          – list user's projects
router.get('/', getProjects);

// POST   /api/projects          – create a new project
router.post('/', validate(createProjectSchema), createProject);

// GET    /api/projects/:id      – get project details + members
router.get('/:id', requireProjectRole('MEMBER'), getProjectById);

// PUT    /api/projects/:id      – update project
router.put('/:id', requireProjectRole('ADMIN'), validate(updateProjectSchema), updateProject);

// DELETE /api/projects/:id      – delete project
router.delete('/:id', requireProjectRole('ADMIN'), deleteProject);

// POST   /api/projects/:id/members       – add member
router.post('/:id/members', requireProjectRole('ADMIN'), validate(addMemberSchema), addMember);

// DELETE /api/projects/:id/members/:userId – remove member
router.delete('/:id/members/:userId', requireProjectRole('ADMIN'), removeMember);

export default router;
