import { useEffect, useState } from 'react';
import { UserRole } from '@/types';
import { SelectionCard } from '@/components/SelectionCard';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/Button';
import { 
  User, FileText, Users, LayoutGrid, UserCog, HeartHandshake,
  GraduationCap, Laptop, ClipboardCheck, MessageSquare, AlertTriangle,
  Search, Edit, Trash2, Plus, PlusCircle, Lock, UserCircle, Database,
  Activity, BarChart, PieChart, Settings, Tag, RefreshCw, X,
  Book, BookOpen, Briefcase, Building, Star, Heart, Award,
  Monitor, Smartphone, Mail, Bell, Calendar, Code, Terminal,
  Lightbulb, Target, Compass, Globe, Palette, Music, Camera
} from 'lucide-react';
import type { AdminRole } from '@/types/roles';

// Map fetched roles to UI items
type RoleItem = {
  role: string;
  icon: React.ReactNode;
  description: string;
};

// Create icon map for safe lookups
const iconMap = {
  User, FileText, Users, LayoutGrid, UserCog, HeartHandshake,
  GraduationCap, Laptop, ClipboardCheck, MessageSquare, AlertTriangle,
  Search, Edit, Trash2, Plus, PlusCircle, Lock, UserCircle, Database,
  Activity, BarChart, PieChart, Settings, Tag, RefreshCw, X,
  Book, BookOpen, Briefcase, Building, Star, Heart, Award,
  Monitor, Smartphone, Mail, Bell, Calendar, Code, Terminal,
  Lightbulb, Target, Compass, Globe, Palette, Music, Camera
};

// Define a simple function to render icons safely
function renderIcon(iconName: string, size = 24, className = '') {
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback to User icon if the specified icon doesn't exist
  return <User size={size} className={className} />;
}

export function RoleSelectionStep() {
  const { selectedRoles, toggleRole, nextStep, availableRoles } = useAppContext();
  const [roleItems, setRoleItems] = useState<RoleItem[]>([]);

  useEffect(() => {
    // Transform the roles from context into the format needed for display
    const items: RoleItem[] = availableRoles.map(r => {
      return {
        role: r.name,
        description: r.description || '',
        // Use our inline renderIcon function
        icon: renderIcon(r.icon || 'User', 24, 'w-6 h-6')
      };
    });

    setRoleItems(items);
  }, [availableRoles]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">What's your role?</h1>
        <p className="text-gray-600">Select your primary role to help us find relevant resources for you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {roleItems.map(({ role, icon, description }: RoleItem) => (
          <SelectionCard
            key={role}
            title={role}
            icon={icon}
            description={description}
            selected={selectedRoles.includes(role)}
            onClick={() => toggleRole(role)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={nextStep}
          className="px-8"
          disabled={selectedRoles.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}