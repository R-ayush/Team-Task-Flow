import supabase from '../config/supabase.js';
import { sendError } from '../utils/response.js';

/**
 * Middleware factory that checks the user's role within a project.
 * @param {'ADMIN'|'MEMBER'} role – minimum required role
 */
export function requireProjectRole(role) {
  return async (req, res, next) => {
    try {
      // Extract project id from route params (could be :id or :projectId)
      const projectId = req.params.id || req.params.projectId;

      if (!projectId) {
        return sendError(res, 'Project ID is required.', 400);
      }

      // Look up the user's membership in this project
      const { data: membership, error } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', req.user.id)
        .single();

      if (error || !membership) {
        return sendError(res, 'You are not a member of this project.', 403);
      }

      // If ADMIN role is required, verify the member has ADMIN role
      if (role === 'ADMIN' && membership.role !== 'ADMIN') {
        return sendError(res, 'Admin access required for this action.', 403);
      }

      // Attach membership to request for downstream use
      req.projectMember = membership;
      next();
    } catch (err) {
      next(err);
    }
  };
}
