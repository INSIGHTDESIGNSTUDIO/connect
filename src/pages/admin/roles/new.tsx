import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { RoleForm } from '@/components/admin/RoleForm';
import { AdminRole } from '@/types/roles';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export default function NewRolePage() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [router, status]);

  const handleSubmit = async (roleData: Omit<AdminRole, 'id'>) => {
    setIsSubmitting(true);
    
    try {
      // Use the API route instead of direct SQLite import
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create role');
      }
      
      const newRole = await response.json();
      console.log('Role created successfully:', newRole);
      router.push('/admin/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== 'authenticated') {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={[
        { label: 'Admin', href: '/admin' },
        { label: 'Manage Roles', href: '/admin/roles' },
        { label: 'Create New Role' }
      ]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Role</h1>
        <button 
          onClick={() => router.push('/admin/roles')}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
      
      <RoleForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
