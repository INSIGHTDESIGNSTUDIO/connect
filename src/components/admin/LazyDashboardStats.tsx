// Create: src/components/admin/LazyDashboardStats.tsx

import dynamic from 'next/dynamic';

// Dynamically import DashboardStats only when needed
const DashboardStats = dynamic(
  () => import('./DashboardStats'),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    ),
    ssr: false // Disable server-side rendering for charts
  }
);

export default DashboardStats;