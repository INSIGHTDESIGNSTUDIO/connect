import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NeedForm } from '@/components/admin/NeedForm';
import { AdminNeed } from '@/types/needs';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/Button';

export default function NewNeedPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!session) {
      router.push('/admin');
      return;
    }
  }, [router, session]);

  const handleSubmit = async (needData: Omit<AdminNeed, 'id'>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(needData),
      });

      if (!response.ok) {
        throw new Error('Failed to create need');
      }

      const need = await response.json();
      console.log('Need created successfully:', need);
      router.push('/admin/needs');
    } catch (error) {
      console.error('Error creating need:', error);
      alert('Failed to create need. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={[
        { label: 'Admin', href: '/admin' },
        { label: 'Manage Needs', href: '/admin/needs' },
        { label: 'Create New Need' }
      ]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Need</h1>
        <Button 
          onClick={() => router.push('/admin/needs')}
          variant="outline"
        >
          Cancel
        </Button>
      </div>
      
      <NeedForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
