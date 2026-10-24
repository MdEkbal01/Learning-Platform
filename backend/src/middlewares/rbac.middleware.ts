import { Request, Response, NextFunction } from 'express';

/**
 * Ken Classes - Role Power Hierarchy & Permission Specification
 * 
 * 1. SUPER_ADMIN (Power Level 100):
 *    - Sovereign root authority (e.g., Zainul Abideen, Hasnain).
 *    - Exclusively controls System Maintenance Mode flags and global bypass.
 *    - Exclusively accesses the Complete Platform Security Audit Logs.
 *    - Exclusively can elevate or demote users to Admin or Super Admin roles.
 *    - Complete oversight across all platform verticals, financial records, and providers.
 *    - IMMUTABLE: Root Super Admin accounts cannot be suspended or demoted by anyone.
 * 
 * 2. ADMIN (Power Level 80):
 *    - High-level platform operational authority.
 *    - Manage course catalogues, curriculums (Class 1 to PhD), pricing, and modules.
 *    - Inspect user directories and grant manual course enrollments.
 *    - Suspend / Reactivate violating students, mentors, and operational staff with required reason.
 *    - STRICT BOUNDARIES: Cannot alter Maintenance Mode, cannot read Audit Logs, cannot modify or suspend Admins or Super Admins.
 * 
 * 3. CONTENT_MANAGER (Power Level 50):
 *    - Academic course curriculum creator.
 *    - Design modules, upload lectures, add syllabus notes, create quizzes, and set INR pricing presets.
 * 
 * 4. FINANCE_SUPPORT (Power Level 50):
 *    - Review payment transactions, manage INR refund requests, reconcile gateway settlements.
 * 
 * 5. MODERATOR (Power Level 40):
 *    - Community forum moderation, triage reported posts, flag inappropriate discussions or tickets.
 * 
 * 6. MENTOR (Power Level 30):
 *    - Schedule and host live interactive video sessions.
 *    - Resolve assigned student doubt queries with 1-on-1 replies and attachments.
 * 
 * 7. STUDENT (Power Level 10):
 *    - Browse course offerings, purchase courses, attend live classes, take quizzes, obtain certificates.
 *    - DATA ISOLATION: Cannot see any other user's private data, phone, email, orders, or progress records.
 */
export const ROLE_POWER: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  CONTENT_MANAGER: 50,
  FINANCE_SUPPORT: 50,
  MODERATOR: 40,
  MENTOR: 30,
  STUDENT: 10,
};

export function requireRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized. Authentication is required.' });
      return;
    }

    const userRole = req.user.role;

    // Super Admin has universal operational oversight across all role-protected endpoints
    if (userRole === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: 'Forbidden. You do not possess the required permissions for this action.',
        requiredRoles: allowedRoles,
        currentRole: userRole,
      });
      return;
    }

    next();
  };
}
