import { useState } from 'react';
import { AdminRole } from '@/types/roles';
import { IconSelector } from './SimplifiedIconSelector';
import { Button } from '@/components/ui/Button';

interface RoleFormProps {
  initialRole?: AdminRole;
  onSubmit: (roleData: Omit<AdminRole, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function RoleForm({ initialRole, onSubmit, isSubmitting }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: initialRole?.name || '',
    description: initialRole?.description || '',
    icon: initialRole?.icon || 'User' // Default icon if none is provided
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create role data with current timestamp
    const now = new Date().toISOString();
    
    const roleData = {
      ...formData,
      createdAt: initialRole?.createdAt || now,
      updatedAt: now
    };
    
    onSubmit(roleData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Role Name *
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
      
      {/* Simplified Icon Selector Component */}
      <IconSelector 
        selectedIcon={formData.icon}
        onSelectIcon={handleIconSelect}
      />
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
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
          {isSubmitting ? 'Saving...' : initialRole ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
}