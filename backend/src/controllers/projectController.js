import { z } from 'zod';
import supabase from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Validation schemas ──────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: 'Project name is required' })
    .min(1, 'Project name is required')
    .max(200, 'Project name must be at most 200 characters'),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .optional()
    .nullable(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name cannot be empty')
    .max(200, 'Project name must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .optional()
    .nullable(),
});

export const addMemberSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER'], {
    errorMap: () => ({ message: 'Role must be ADMIN or MEMBER' }),
  }),
});

// ── Controllers ─────────────────────────────────────────────────────

/**
 * GET /api/projects
 * Get all projects where the authenticated user is a member.
 */
export async function getProjects(req, res, next) {
  try {
    // Get all project IDs the user is a member of
    const { data: memberships, error: memError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', req.user.id);

    if (memError) throw memError;

    const projectIds = memberships.map((m) => m.project_id);

    if (projectIds.length === 0) {
      return sendSuccess(res, [], 'No projects found.');
    }

    const { data: projects, error: projError } = await supabase
      .from('projects')
      .select('*')
      .in('id', projectIds)
      .order('created_at', { ascending: false });

    if (projError) throw projError;

    return sendSuccess(res, projects, 'Projects retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects
 * Create a new project and add the creator as ADMIN member.
 */
export async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;

    // Insert the project
    const { data: project, error: projError } = await supabase
      .from('projects')
      .insert({ name, description, owner_id: req.user.id })
      .select()
      .single();

    if (projError) throw projError;

    // Add creator as ADMIN member
    const { error: memError } = await supabase
      .from('project_members')
      .insert({ project_id: project.id, user_id: req.user.id, role: 'ADMIN' });

    if (memError) throw memError;

    return sendSuccess(res, project, 'Project created successfully.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:id
 * Get a single project by ID, including its members with user info.
 */
export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch the project
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projError) {
      if (projError.code === 'PGRST116') {
        return sendError(res, 'Project not found.', 404);
      }
      throw projError;
    }

    // Fetch members with user info
    const { data: memberships, error: memError } = await supabase
      .from('project_members')
      .select('id, role, user_id, users(id, name, email)')
      .eq('project_id', id);

    if (memError) throw memError;

    // Flatten member data
    const members = memberships.map((m) => ({
      membership_id: m.id,
      role: m.role,
      user_id: m.user_id,
      name: m.users?.name,
      email: m.users?.email,
    }));

    return sendSuccess(
      res,
      { ...project, members },
      'Project retrieved successfully.'
    );
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/projects/:id
 * Update project name/description. Requires ADMIN role (handled by middleware).
 */
export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;

    if (Object.keys(updateFields).length === 0) {
      return sendError(res, 'No fields to update.', 400);
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, project, 'Project updated successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/projects/:id
 * Delete a project. Requires ADMIN role (handled by middleware).
 */
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw error;

    return sendSuccess(res, null, 'Project deleted successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects/:id/members
 * Add a user to the project. Body: { email, role }.
 */
export async function addMember(req, res, next) {
  try {
    const { id: projectId } = req.params;
    const { email, role } = req.body;

    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return sendError(res, 'User with this email not found.', 404);
    }

    // Check if already a member
    const { data: existing, error: existError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return sendError(res, 'User is already a member of this project.', 409);
    }

    // existError is expected (PGRST116) when user is not a member
    if (existError && existError.code !== 'PGRST116') {
      throw existError;
    }

    // Insert membership
    const { data: membership, error: insertError } = await supabase
      .from('project_members')
      .insert({ project_id: projectId, user_id: user.id, role })
      .select()
      .single();

    if (insertError) throw insertError;

    return sendSuccess(
      res,
      { ...membership, user },
      'Member added successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/projects/:id/members/:userId
 * Remove a user from the project. Cannot remove the project owner.
 */
export async function removeMember(req, res, next) {
  try {
    const { id: projectId, userId } = req.params;

    // Fetch project to check ownership
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('owner_id')
      .eq('id', projectId)
      .single();

    if (projError) throw projError;

    // Cannot remove the owner
    if (project.owner_id === userId) {
      return sendError(res, 'Cannot remove the project owner.', 403);
    }

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;

    return sendSuccess(res, null, 'Member removed successfully.');
  } catch (err) {
    next(err);
  }
}
