import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { updateResource, getRoles, getNeeds, getResourceById } from '@/lib/sqlite';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { Resource, UserNeed, UserRole } from '@/types';
import { AdminRole } from '@/types/roles';
import { AdminNeed } from '@/types/needs';
import { PlusCircle } from 'lucide-react';
import { IconSelector } from '@/components/admin/SimplifiedIconSelector';
import { MultiSelect } from '@/components/ui/MultiSelect';

export default function EditResourcePage() {
  const { data: session } = useSession();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Standard form data - added actionText field with default
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    resourceType: '',
    icon: 'FileText', // Default icon
    featured: false,
    tags: '',
    actionText: 'View Resource' // Default action text
  });
  
  // Separate states for roles and needs
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  
  // States for predefined options from database
  const [roleOptions, setRoleOptions] = useState<{value: string, label: string}[]>([]);
  const [needOptions, setNeedOptions] = useState<{value: string, label: string}[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Check if user is authenticated
    if (!session) {
      router.push('/admin');
      return;
    }
    
    fetchRolesAndNeeds();
    
    if (id) {
      fetchResource(id as string);
    }
  }, [router, id, session]);
  
  const fetchRolesAndNeeds = async () => {
    setLoadingOptions(true);
    try {
      // Fetch roles and needs in parallel
      const [rolesData, needsData] = await Promise.all([
        getRoles(),
        getNeeds()
      ]);
      
      // Format roles for MultiSelect
      const formattedRoles = rolesData.map((role) => ({
        value: role.name,
        label: role.name
      }));
      
      // Format needs for MultiSelect
      const formattedNeeds = needsData.map((need) => ({
        value: need.name,
        label: need.name
      }));
      
      setRoleOptions(formattedRoles);
      setNeedOptions(formattedNeeds);
    } catch (error) {
      console.error('Error fetching roles and needs:', error);
      // Set fallback options
      setRoleOptions([
        { value: 'HE Lecturer', label: 'HE Lecturer' },
        { value: 'VET/TAFE Lecturer', label: 'VET/TAFE Lecturer' },
        { value: 'Unit Coordinator', label: 'Unit Coordinator' },
        { value: 'Professional Staff', label: 'Professional Staff' },
        { value: 'New to Teaching', label: 'New to Teaching' }
      ]);
      
      setNeedOptions([
        { value: 'Teaching Resources', label: 'Teaching Resources' },
        { value: 'Unit Development', label: 'Unit Development' },
        { value: 'Student Support', label: 'Student Support' },
        { value: 'Professional Development', label: 'Professional Development' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Assessment', label: 'Assessment' },
        { value: 'Feedback', label: 'Feedback' }
      ]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchResource = async (resourceId: string) => {
    setLoading(true);
    try {
      const data = await getResourceById(resourceId);

      if (!data) {
        console.error('Error fetching resource: Resource not found');
        alert('Resource not found');
        router.push('/admin/resources');
        return;
      }
      
      if (data) {
        // Log the raw data to debug
        console.log('Raw resource data:', data);
        
        setResource(data);
        
        // Set form data - now including actionText
        setFormData({
          title: data.title || '',
          description: data.description || '',
          url: data.url || '',
          resourceType: data.resourceType || '',
          icon: data.icon || 'FileText',
          featured: Boolean(data.featured),
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          actionText: data.actionText || 'View Resource' // Use default if not set
        });
        
        // Process roles and needs ensuring they're arrays
        let roles: string[] = [];
        if (Array.isArray(data.roles)) {
          roles = [...data.roles];
        } else if (data.roles && typeof data.roles === 'string') {
          try {
            // Try to parse if it's a JSON string
            roles = JSON.parse(data.roles);
          } catch {
            // If parsing fails, treat as a single item
            roles = [data.roles];
          }
        }
        
        let needs: string[] = [];
        if (Array.isArray(data.needs)) {
          needs = [...data.needs];
        } else if (data.needs && typeof data.needs === 'string') {
          try {
            // Try to parse if it's a JSON string
            needs = JSON.parse(data.needs);
          } catch {
            // If parsing fails, treat as a single item
            needs = [data.needs];
          }
        }
        
        console.log('Processed roles:', roles);
        console.log('Processed needs:', needs);
        
        // Set selected roles and needs
        setSelectedRoles(roles);
        setSelectedNeeds(needs);
      }
    } catch (err) {
      console.error('Unexpected error while fetching resource:', err);
      alert('An error occurred while loading the resource');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add handler for icon selection
  const handleIconSelect = (iconName: string) => {
    setFormData({ ...formData, icon: iconName });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'featured') {
      setFormData({ ...formData, featured: checked });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Debug before sending
    console.log('Before submission - Selected Roles:', selectedRoles);
    console.log('Before submission - Selected Needs:', selectedNeeds);
    
    // Format the data for Supabase - now including actionText
    const resourceUpdates = {
      title: formData.title,
      description: formData.description,
      url: formData.url,
      resourceType: formData.resourceType,
      icon: formData.icon,
      featured: formData.featured,
      roles: selectedRoles,
      needs: selectedNeeds,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      actionText: formData.actionText,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    console.log('Submitting resource updates:', resourceUpdates);
    
    if (id) {
      try {
        const result = await updateResource(id as string, resourceUpdates);
        
        if (result) {
          console.log('Resource updated successfully:', result);
          router.push('/admin/resources');
        } else {
          throw new Error('Failed to update resource');
        }
      } catch (error) {
        console.error('Error updating resource:', error);
        alert('Failed to update resource. Please check the console for details.');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!session || !resource) {
    return null; // Router will redirect to /admin
  }

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs items={[
        { label: 'Admin', href: '/admin' },
        { label: 'Manage Resources', href: '/admin/resources' },
        { label: 'Edit Resource' }
      ]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Resource</h1>
        <Button onClick={() => router.push('/admin/resources')} variant="outline">
          Cancel
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md h-24"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="url">
            URL *
          </label>
          <input
            id="url"
            name="url"
            type="text"
            value={formData.url}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        {/* Grid for Resource Type and Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="resourceType">
              Resource Type *
            </label>
            <select
              id="resourceType"
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a type</option>
              <option value="Guide">Guide</option>
              <option value="Template">Template</option>
              <option value="Workshop">Workshop</option>
              <option value="Video">Video</option>
              <option value="Article">Article</option>
              <option value="Tool">Tool</option>
              <option value="Training">Training</option>
              <option value="Policy">Policy</option>
              <option value="Information">Information</option>
            </select>
          </div>
          
          {/* Add the Icon Selector */}
          <div>
            <IconSelector 
              selectedIcon={formData.icon}
              onSelectIcon={handleIconSelect}
            />
          </div>
        </div>
        
        {/* Action Text Input with Suggestions */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="actionText">
            Action Text
          </label>
          <div className="space-y-2">
            <input
              id="actionText"
              name="actionText"
              type="text"
              value={formData.actionText}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="View Resource, Go to, Link, External Resource, Speak With, etc."
            />
            <div className="flex flex-wrap gap-2">
              {["View Resource", "Go to", "Link", "External Resource", "Speak With"].map(text => (
                <button
                  key={text}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-md border ${
                    formData.actionText === text 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                  onClick={() => setFormData({...formData, actionText: text})}
                >
                  {text}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Custom text for the resource link button. Default is "View Resource".
            </p>
          </div>
        </div>
        
        {/* Roles MultiSelect */}
        <div>
          {loadingOptions ? (
            <div className="py-4">Loading roles...</div>
          ) : (
            <MultiSelect
              options={roleOptions}
              selectedValues={selectedRoles}
              onChange={setSelectedRoles}
              label="Target Roles"
              placeholder="Select target roles..."
              required
            />
          )}
        </div>
        
        {/* Needs MultiSelect */}
        <div>
          {loadingOptions ? (
            <div className="py-4">Loading needs...</div>
          ) : (
            <MultiSelect
              options={needOptions}
              selectedValues={selectedNeeds}
              onChange={setSelectedNeeds}
              label="Target Needs"
              placeholder="Select target needs..."
              required
            />
          )}
        </div>
        
        {/* Enhanced Tags input with predefined options */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tags">
            Tags
          </label>
          <div className="space-y-2">
            <input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter tags separated by commas"
            />
            
            {/* Predefined tag options */}
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Predefined tags:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Academic Quality and Integrity (AQI)",
                  "Course Accreditation and Registration (CAR)",
                  "Curriculum, Assessment and Teaching (CAT)",
                  "Deputy Provost Office",
                  "Learning Experience (LX)",
                  "Learning Systems and Resources (LSR)"
                ].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`px-2 py-1 text-xs rounded-md border ${
                      formData.tags.includes(tag) 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      // Add the tag to the list if it's not already included
                      const currentTags = formData.tags
                        ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
                        : [];
                      
                      if (!currentTags.includes(tag)) {
                        const newTags = [...currentTags, tag].join(', ');
                        setFormData({...formData, tags: newTags});
                      } else {
                        // Remove the tag if it's already included
                        const newTags = currentTags.filter(t => t !== tag).join(', ');
                        setFormData({...formData, tags: newTags});
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="featured">Featured Resource</label>
        </div>
        
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Update Resource'}
        </Button>
      </form>
    </div>
  );
}
