import prisma from "../db";

export class DashboardService {
  async getAdminStats() {
    const [totalUsers, totalVenues, totalFields, pendingVenues] = await Promise.all([
      prisma.user.count(),
      prisma.venue.count(),
      prisma.field.count(),
      prisma.venue.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalVenues,
      totalFields,
      pendingVenues,
    };
  }

  async getRenterStats(renterId: string) {
    const [totalVenues, totalFields, pendingVenues, totalBookings] = await Promise.all([
      prisma.venue.count({ where: { renterId } }),
      prisma.field.count({ where: { venue: { renterId } } }),
      prisma.venue.count({ where: { renterId, status: 'PENDING' } }),
      prisma.booking.count({ where: { field: { venue: { renterId } } } }),
    ]);

    return {
      totalVenues,
      totalFields,
      pendingVenues,
      totalBookings,
    };
  }
}
