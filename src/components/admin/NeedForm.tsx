import { useState, useEffect } from 'react';
import { AdminNeed } from '@/types/needs';
import { Role } from '@/types';
import { IconSelector } from './SimplifiedIconSelector';
import { Button } from '@/components/ui/Button';
import { getRoles } from '@/lib/sqlite';

interface NeedFormProps {
  initialNeed?: AdminNeed;
  onSubmit: (needData: Omit<AdminNeed, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function NeedForm({ initialNeed, onSubmit, isSubmitting }: NeedFormProps) {
  const [formData, setFormData] = useState({
    name: initialNeed?.name || '',
    description: initialNeed?.description || '',
    icon: initialNeed?.icon || 'FileText', // Default icon if none is provided
    roles: initialNeed?.roles || []
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const roles = await getRoles();
        setAvailableRoles(roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => {
      const roleExists = prev.roles.includes(roleId);
      const updatedRoles = roleExists
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId];
      
      return { ...prev, roles: updatedRoles };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create need data with current timestamp
    const now = new Date().toISOString();
    
    const needData = {
      ...formData,
      createdAt: initialNeed?.createdAt || now,
      updatedAt: now
    };
    
    onSubmit(needData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Need Heading *
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

      {/* Role selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Related Roles
        </label>
        {isLoadingRoles ? (
          <p className="text-sm text-gray-500">Loading roles...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {availableRoles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`role-${role.id}`}
                  checked={formData.roles.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  className="rounded border-gray-300"
                />
                <label htmlFor={`role-${role.id}`} className="text-sm">
                  {role.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialNeed ? 'Update Need' : 'Create Need'}
        </Button>
      </div>
    </form>
  );
}
