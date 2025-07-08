import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NeedForm } from '@/components/admin/NeedForm';
import { AdminNeed } from '@/types/needs';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Button } from '@/components/ui/Button';

export default function EditNeedPage() {
  const { data: session } = useSession();
  const [need, setNeed] = useState<AdminNeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Check if user is authenticated
    if (!session) {
      router.push('/admin');
      return;
    }
    
    if (id) {
      fetchNeed(id as string);
    }
  }, [router, id, session]);

  const fetchNeed = async (needId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/needs/${needId}`);

      if (!response.ok) {
        alert('Need not found');
        router.push('/admin/needs');
        return;
      }

      const needData = await response.json();
      setNeed(needData);
    } catch (error) {
      console.error('Error fetching need:', error);
      alert('An error occurred while loading the need');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (needData: Omit<AdminNeed, 'id'>) => {
    setIsSubmitting(true);

    try {
      if (id) {
        const response = await fetch(`/api/needs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(needData),
        });

        if (!response.ok) {
          throw new Error('Failed to update need');
        }

        const updatedNeed = await response.json();
        console.log('Need updated successfully:', updatedNeed);
        router.push('/admin/needs');
      }
    } catch (error) {
      console.error('Error updating need:', error);
      alert('Failed to update need. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || !need) {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={[
        { label: 'Admin', href: '/admin' },
        { label: 'Manage Needs', href: '/admin/needs' },
        { label: 'Edit Need' }
      ]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Need: {need.name}</h1>
        <Button 
          onClick={() => router.push('/admin/needs')}
          variant="outline"
        >
          Cancel
        </Button>
      </div>
      
      <NeedForm 
        initialNeed={need}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
