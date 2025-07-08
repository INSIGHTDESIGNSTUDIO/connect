import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Resource } from '@/types';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useSession } from 'next-auth/react';
import { FileText, Edit as EditIcon, Trash2, Plus } from 'lucide-react';

export default function ManageResourcesPage() {
  const { data: session, status } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }
    
    if (status === 'authenticated') {
      fetchResources();
    }
  }, [router, status]);

  const fetchResources = async () => {
    console.log('Fetching resources in admin page...');
    setLoading(true);
    try {
      const response = await fetch('/api/resources');
      console.log('Resources API response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const resourcesData = await response.json();
      console.log('Resources data received:', resourcesData);
      setResources(resourcesData || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setLoading(false);
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (status !== 'authenticated') {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <AdminHeader activeSection="resources" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Resources</h1>
          <p className="text-gray-600 text-sm mt-1">View, edit, and delete educational resources</p>
        </div>
        <Button
          onClick={() => router.push('/admin/resources/new')}
          style={{ backgroundColor: '#007a87' }}
          className="hover:bg-opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Resource
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {resources.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No resources found</h3>
            <p className="text-gray-500">Start by adding a new resource.</p>
            <Button 
              onClick={() => router.push('/admin/resources/new')}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {resource.resourceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(resource.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/admin/resources/edit/${resource.id}`)}
                      >
                        <EditIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteResource(resource.id)}
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
