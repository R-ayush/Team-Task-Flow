import supabase from '../config/supabase.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/dashboard
 * Aggregate stats for the logged-in user across all their projects.
 */
export async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Get all project IDs the user is a member of
    const { data: memberships, error: memError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userId);

    if (memError) throw memError;

    const projectIds = memberships.map((m) => m.project_id);

    // Default dashboard when user has no projects
    if (projectIds.length === 0) {
      return sendSuccess(
        res,
        {
          totalTasks: 0,
          tasksByStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
          overdueTasks: 0,
          myAssignedTasks: [],
        },
        'Dashboard data retrieved.'
      );
    }

    // 2. Fetch all tasks across user's projects
    const { data: allTasks, error: tasksError } = await supabase
      .from('tasks')
      .select(
        '*, project:projects(id, name), assigned_to:users!tasks_assigned_to_id_fkey(id, name, email), created_by:users!tasks_created_by_id_fkey(id, name, email)'
      )
      .in('project_id', projectIds);

    if (tasksError) throw tasksError;

    // 3. Compute stats
    const totalTasks = allTasks.length;

    const tasksByStatus = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };
    allTasks.forEach((task) => {
      if (tasksByStatus[task.status] !== undefined) {
        tasksByStatus[task.status]++;
      }
    });

    // Overdue: status != DONE and due_date < now
    const now = new Date();
    const overdueTasks = allTasks.filter(
      (task) =>
        task.status !== 'DONE' &&
        task.due_date &&
        new Date(task.due_date) < now
    ).length;

    // My assigned tasks
    const myAssignedTasks = allTasks.filter(
      (task) => task.assigned_to_id === userId
    );

    return sendSuccess(
      res,
      {
        totalTasks,
        tasksByStatus,
        overdueTasks,
        myAssignedTasks,
      },
      'Dashboard data retrieved.'
    );
  } catch (err) {
    next(err);
  }
}
