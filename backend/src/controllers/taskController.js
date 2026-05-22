import { z } from 'zod';
import supabase from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/response.js';

// ── Validation schemas ──────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(300, 'Title must be at most 300 characters'),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .nullable(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .optional(),
  due_date: z.string().datetime({ offset: true }).optional().nullable(),
  assigned_to_id: z.string().uuid('Invalid user ID').optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(300, 'Title must be at most 300 characters')
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .nullable(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .optional(),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'DONE'], {
      errorMap: () => ({
        message: 'Status must be TODO, IN_PROGRESS, or DONE',
      }),
    })
    .optional(),
  due_date: z.string().datetime({ offset: true }).optional().nullable(),
  assigned_to_id: z.string().uuid('Invalid user ID').optional().nullable(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    errorMap: () => ({
      message: 'Status must be TODO, IN_PROGRESS, or DONE',
    }),
  }),
});

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Check if user is ADMIN of the task's project OR the assigned member.
 */
async function canModifyTask(task, userId) {
  // Check if the user is the assigned member
  if (task.assigned_to_id === userId) {
    return true;
  }

  // Check if user is ADMIN of the project
  const { data: membership, error } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', task.project_id)
    .eq('user_id', userId)
    .single();

  if (error || !membership) return false;

  return membership.role === 'ADMIN';
}

// ── Controllers ─────────────────────────────────────────────────────

/**
 * GET /api/projects/:id/tasks
 * Get all tasks for a project. Includes assigned_to and created_by user info.
 */
export async function getTasks(req, res, next) {
  try {
    const projectId = req.params.id;

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(
        '*, assigned_to:users!tasks_assigned_to_id_fkey(id, name, email), created_by:users!tasks_created_by_id_fkey(id, name, email)'
      )
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return sendSuccess(res, tasks, 'Tasks retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/projects/:id/tasks
 * Create a new task in a project.
 */
export async function createTask(req, res, next) {
  try {
    const projectId = req.params.id;
    const { title, description, priority, due_date, assigned_to_id } = req.body;

    // If assigned_to_id is provided, verify the user is a member of the project
    if (assigned_to_id) {
      const { data: membership, error: memError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', assigned_to_id)
        .single();

      if (memError || !membership) {
        return sendError(
          res,
          'Assigned user is not a member of this project.',
          400
        );
      }
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        due_date: due_date || null,
        project_id: projectId,
        assigned_to_id: assigned_to_id || null,
        created_by_id: req.user.id,
      })
      .select(
        '*, assigned_to:users!tasks_assigned_to_id_fkey(id, name, email), created_by:users!tasks_created_by_id_fkey(id, name, email)'
      )
      .single();

    if (error) throw error;

    return sendSuccess(res, task, 'Task created successfully.', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 * Update a task. User must be ADMIN of the project or the assigned member.
 */
export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch the task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        return sendError(res, 'Task not found.', 404);
      }
      throw taskError;
    }

    // Check permissions
    const allowed = await canModifyTask(task, req.user.id);
    if (!allowed) {
      return sendError(
        res,
        'You do not have permission to update this task.',
        403
      );
    }

    const { title, description, priority, status, due_date, assigned_to_id } =
      req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;
    if (due_date !== undefined) updateFields.due_date = due_date;
    if (assigned_to_id !== undefined) updateFields.assigned_to_id = assigned_to_id;
    updateFields.updated_at = new Date().toISOString();

    if (Object.keys(updateFields).length === 1) {
      // Only updated_at, nothing else
      return sendError(res, 'No fields to update.', 400);
    }

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateFields)
      .eq('id', id)
      .select(
        '*, assigned_to:users!tasks_assigned_to_id_fkey(id, name, email), created_by:users!tasks_created_by_id_fkey(id, name, email)'
      )
      .single();

    if (error) throw error;

    return sendSuccess(res, updatedTask, 'Task updated successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task. User must be ADMIN of the task's project.
 */
export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    // Fetch the task to get project_id
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        return sendError(res, 'Task not found.', 404);
      }
      throw taskError;
    }

    // Check that user is ADMIN in the task's project
    const { data: membership, error: memError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', task.project_id)
      .eq('user_id', req.user.id)
      .single();

    if (memError || !membership || membership.role !== 'ADMIN') {
      return sendError(res, 'Only project admins can delete tasks.', 403);
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;

    return sendSuccess(res, null, 'Task deleted successfully.');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/tasks/:id/status
 * Update only the status field of a task. Allowed for ADMIN or assigned member.
 */
export async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        return sendError(res, 'Task not found.', 404);
      }
      throw taskError;
    }

    // Check permissions
    const allowed = await canModifyTask(task, req.user.id);
    if (!allowed) {
      return sendError(
        res,
        'You do not have permission to update this task status.',
        403
      );
    }

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(
        '*, assigned_to:users!tasks_assigned_to_id_fkey(id, name, email), created_by:users!tasks_created_by_id_fkey(id, name, email)'
      )
      .single();

    if (error) throw error;

    return sendSuccess(res, updatedTask, 'Task status updated successfully.');
  } catch (err) {
    next(err);
  }
}
