import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '@/components/Auth';
import { Button } from '@/components/ui/Button';
import { useSession, signOut } from 'next-auth/react';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import LazyDashboardStats from '@/components/admin/LazyDashboardStats';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Database, LayoutGrid, Users, FileText, Activity, UserCog, BarChart, PieChart, Settings } from 'lucide-react';
import { Resource } from '@/types';
import { STYLE_COLORS } from '@/lib/styleGuide';

// Import mock data for client-side fallback
import { mockResources, mockRoles, mockNeeds } from '@/lib/sqlite';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    resources: 0,
    roles: 0,
    needs: 0
  });
  const [resourcesData, setResourcesData] = useState<Resource[]>([]);
  const [rolesData, setRolesData] = useState<any[]>([]);
  const [needsData, setNeedsData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);
  
  const fetchStats = async () => {
    try {
      // Use fetch API to get data from API routes instead of direct SQLite access
      const [resourcesRes, rolesRes, needsRes] = await Promise.all([
        fetch('/api/resources').then(res => res.json()),
        fetch('/api/roles').then(res => res.json()),
        fetch('/api/needs').then(res => res.json())
      ]);

      // Store the full data for visualizations
      setResourcesData(resourcesRes || []);
      setRolesData(rolesRes || []);
      setNeedsData(needsRes || []);

      // Update stats state
      setStats({
        resources: resourcesRes?.length || 0,
        roles: rolesRes?.length || 0,
        needs: needsRes?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data for demo purposes
      setResourcesData(mockResources);
      setRolesData(mockRoles);
      setNeedsData(mockNeeds);

      setStats({
        resources: mockResources.length,
        roles: mockRoles.length,
        needs: mockNeeds.length
      });
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <AdminHeader activeSection="dashboard" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {status !== 'authenticated' ? (
        <>
          <Auth />
        </>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-100 p-2 rounded-full">
                <UserCog className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-600">Logged in as: <span className="font-medium">{session?.user?.email}</span></p>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Resources"
              value={stats.resources}
              icon={<FileText className="h-6 w-6 text-blue-500" />}
              color="blue"
            />
            <StatCard
              title="Total Roles"
              value={stats.roles}
              icon={<Users className="h-6 w-6 text-green-500" />}
              color="green"
            />
            <StatCard
              title="Total Needs"
              value={stats.needs}
              icon={<LayoutGrid className="h-6 w-6 text-purple-500" />}
              color="purple"
            />
            <StatCard
              title="Database Status"
              value="Online"
              icon={<Database className="h-6 w-6 text-teal-500" />}
              color="teal"
            />
          </div>

          {/* Data Visualization */}
          <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                Resource Analytics
              </h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            <LazyDashboardStats
              resources={resourcesData}
              roles={rolesData}
              needs={needsData}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Action Cards */}
            <div
              className="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/admin/resources/new')}
              style={{ borderTop: `3px solid ${STYLE_COLORS.teal}` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-opacity-10" style={{ backgroundColor: `${STYLE_COLORS.teal}1a` }}>
                  <FileText className="h-6 w-6" style={{ color: STYLE_COLORS.teal }} />
                </div>
                <h3 className="mt-2 font-medium">Add Resource</h3>
                <p className="text-xs text-gray-500 mt-1">Create new resource</p>
              </div>
            </div>

            <div
              className="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/admin/roles/new')}
              style={{ borderTop: `3px solid ${STYLE_COLORS.orange}` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-opacity-10" style={{ backgroundColor: `${STYLE_COLORS.orange}1a` }}>
                  <Users className="h-6 w-6" style={{ color: STYLE_COLORS.orange }} />
                </div>
                <h3 className="mt-2 font-medium">Add Role</h3>
                <p className="text-xs text-gray-500 mt-1">Create new role</p>
              </div>
            </div>

            <div
              className="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/admin/needs/new')}
              style={{ borderTop: `3px solid ${STYLE_COLORS.burgundy}` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-opacity-10" style={{ backgroundColor: `${STYLE_COLORS.burgundy}1a` }}>
                  <LayoutGrid className="h-6 w-6" style={{ color: STYLE_COLORS.burgundy }} />
                </div>
                <h3 className="mt-2 font-medium">Add Need</h3>
                <p className="text-xs text-gray-500 mt-1">Create new need</p>
              </div>
            </div>

            <div
              className="bg-white shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/admin/users/new')}
              style={{ borderTop: `3px solid ${STYLE_COLORS.darkPurple}` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-opacity-10" style={{ backgroundColor: `${STYLE_COLORS.darkPurple}1a` }}>
                  <UserCog className="h-6 w-6" style={{ color: STYLE_COLORS.darkPurple }} />
                </div>
                <h3 className="mt-2 font-medium">Add User</h3>
                <p className="text-xs text-gray-500 mt-1">Create new admin user</p>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Management</h2>
            <div
              className="bg-white shadow-sm rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push('/admin/data-management')}
              style={{ borderTop: `3px solid ${STYLE_COLORS.teal}` }}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-opacity-10" style={{ backgroundColor: `${STYLE_COLORS.teal}1a` }}>
                  <Database className="h-8 w-8" style={{ color: STYLE_COLORS.teal }} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Import & Export Data</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Backup your data or batch import resources, roles, needs, and users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// StatCard component for displaying stats
function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'teal' | 'red';
}) {
  // Map color names to style guide colors
  const colors = {
    blue: STYLE_COLORS.lightBlue,
    green: STYLE_COLORS.teal,
    purple: STYLE_COLORS.darkPurple,
    teal: STYLE_COLORS.teal,
    red: STYLE_COLORS.burgundy,
  };

  const textColors = {
    blue: 'text-gray-800',
    green: 'text-white',
    purple: 'text-white',
    teal: 'text-white',
    red: 'text-white',
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-sm ${textColors[color]}`}
      style={{ backgroundColor: colors[color] }}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm font-medium mb-1 opacity-90">{title}</span>
          <div className="font-bold text-2xl">{value}</div>
        </div>
        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

// AdminCard component with action button
function AdminCard({
  title,
  description,
  onClick,
  actionText,
  primary = false
}: {
  title: string;
  description: string;
  onClick: () => void;
  actionText: string;
  primary?: boolean;
}) {
  return (
    <div className="p-5 border rounded-lg bg-white hover:shadow-md transition-all hover:translate-y-[-2px] duration-300">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>
        <button
          onClick={onClick}
          className={`w-full py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
            primary
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
          }`}
        >
          {actionText}
        </button>
      </div>
    </div>
  );
}
