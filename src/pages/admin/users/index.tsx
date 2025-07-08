import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SafeUser } from '@/types/users';
import { Users, Edit as EditIcon, Trash2, Plus, UserCircle, Lock } from 'lucide-react';

// Style guide colors
const STYLE_COLORS = {
  darkPurple: '#211645',
  teal: '#007a87',
  orange: '#d55c19',
  burgundy: '#a71930',
  lightBlue: '#a0cfeb',
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin');
      return;
    }
    
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [router, status]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const userData = await response.json();
      setUsers(userData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    // Don't allow deleting your own account
    if (session?.user?.id === id) {
      alert("You cannot delete your own account");
      return;
    }
    
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };
  
  const handleChangePassword = async (id: string) => {
    const newPassword = prompt('Enter new password (minimum 8 characters):');
    
    if (!newPassword) return;
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
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
      <AdminHeader activeSection="users" />
      <Breadcrumbs items={[
        { label: 'Admin', href: '/admin' },
        { label: 'Manage Users' }
      ]} />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <p className="text-gray-600 mt-1">View, edit, and manage admin users</p>
        </div>
        <div className="space-x-3">
          <Button 
            onClick={() => router.push('/admin')}
            variant="outline"
            className="border-gray-300"
          >
            Back to Admin
          </Button>
          <Button 
            onClick={() => router.push('/admin/users/new')}
            style={{ backgroundColor: STYLE_COLORS.teal, color: 'white' }}
            className="hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500">Start by adding a new admin user.</p>
            <Button 
              onClick={() => router.push('/admin/users/new')}
              className="mt-4 hover:opacity-90"
            style={{ backgroundColor: STYLE_COLORS.teal, color: 'white' }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full" style={{ backgroundColor: `${STYLE_COLORS.lightBlue}40` }}>
                          <UserCircle className="h-5 w-5" style={{ color: STYLE_COLORS.darkPurple }} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.email}</div>
                          {user.id === session?.user?.id && (
                            <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${STYLE_COLORS.teal}20`, color: STYLE_COLORS.teal }}>
                              Current User
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:opacity-90"
                        style={{ borderColor: `${STYLE_COLORS.teal}40`, color: STYLE_COLORS.teal }}
                        onClick={() => handleChangePassword(user.id)}
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Change Password
                      </Button>
                      {user.id !== session?.user?.id && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:opacity-90"
                          style={{ borderColor: `${STYLE_COLORS.burgundy}40`, color: STYLE_COLORS.burgundy }}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
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