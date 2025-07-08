import { useState } from 'react';
import { AdminResourceType } from '@/types';

interface ResourceTypeFormProps {
  initialType?: AdminResourceType;
  onSubmit: (typeData: Omit<AdminResourceType, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function ResourceTypeForm({ initialType, onSubmit, isSubmitting }: ResourceTypeFormProps) {
  const [formData, setFormData] = useState({
    name: initialType?.name || '',
    description: initialType?.description || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const typeData = {
      ...formData,
      createdAt: initialType?.createdAt || now,
      updatedAt: now
    };
    onSubmit(typeData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Type Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md h-24"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (initialType ? 'Updating...' : 'Saving...') : initialType ? 'Update Type' : 'Create Type'}
        </button>
      </div>
    </form>
  );
}