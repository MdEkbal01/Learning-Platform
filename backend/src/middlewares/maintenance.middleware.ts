import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';

export function checkMaintenance(featureKey?: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Super admin can bypass maintenance
      if (req.user?.role === 'SUPER_ADMIN') {
        return next();
      }

      // Check global maintenance
      const globalFlag = await prisma.maintenanceFlag.findUnique({
        where: { featureKey: 'PLATFORM_GLOBAL' },
      });

      if (globalFlag && globalFlag.isEnabled) {
        res.status(503).json({
          error: 'Platform Maintenance in Progress',
          message: globalFlag.message,
          isMaintenance: true,
          feature: 'PLATFORM_GLOBAL',
        });
        return;
      }

      // Check feature-specific maintenance
      if (featureKey) {
        const featureFlag = await prisma.maintenanceFlag.findUnique({
          where: { featureKey },
        });

        if (featureFlag && featureFlag.isEnabled) {
          res.status(503).json({
            error: `${featureKey} Feature Maintenance`,
            message: featureFlag.message,
            isMaintenance: true,
            feature: featureKey,
          });
          return;
        }
      }

      next();
    } catch (error) {
      next();
    }
  };
}
