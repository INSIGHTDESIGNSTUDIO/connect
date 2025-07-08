import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AdminNeed } from '@/types/needs';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DynamicIcon } from '@/components/DynamicIcon';
import { LayoutGrid, Plus, Edit as EditIcon, Trash2 } from 'lucide-react';

export default function NeedsPage() {
  const { data: session } = useSession();
  const [needs, setNeeds] = useState<AdminNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!session) {
      router.push('/admin');
      return;
    }
    fetchNeeds();
  }, [router, session]);

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/needs');
      if (!response.ok) {
        throw new Error('Failed to fetch needs');
      }
      const needsData = await response.json();
      setNeeds(needsData);
    } catch (error) {
      console.error('Error fetching needs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNeed = async (id: string) => {
    if (!confirm('Are you sure you want to delete this need?')) return;

    try {
      const response = await fetch(`/api/needs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete need');
      }

      // Refresh the needs list
      fetchNeeds();
    } catch (error) {
      console.error('Error deleting need:', error);
      alert('Failed to delete need');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session) {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <AdminHeader activeSection="needs" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Needs</h1>
          <p className="text-gray-600 text-sm mt-1">View, edit, and delete user needs categories</p>
        </div>
        <Button
          onClick={() => router.push('/admin/needs/new')}
          style={{ backgroundColor: '#a71930' }}
          className="hover:bg-opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Need
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {needs.length === 0 ? (
          <div className="p-8 text-center">
            <LayoutGrid className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No needs found</h3>
            <p className="text-gray-500">Start by adding a new need category.</p>
            <Button 
              onClick={() => router.push('/admin/needs/new')}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Need
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Roles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {needs.map((need) => (
                  <tr key={need.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                        <DynamicIcon iconName={need.icon} className="w-5 h-5 text-purple-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{need.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{need.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {need.roles?.length || 0} roles
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(need.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => router.push(`/admin/needs/edit/${need.id}`)}
                      >
                        <EditIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteNeed(need.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
