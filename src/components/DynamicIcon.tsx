import { 
  User, FileText, Users, LayoutGrid, UserCog, HeartHandshake,
  GraduationCap, Laptop, ClipboardCheck, MessageSquare, AlertTriangle,
  Search, Edit, Trash2, Plus, PlusCircle, Lock, UserCircle, Database,
  Activity, BarChart, PieChart, Settings, Tag, RefreshCw, X
} from 'lucide-react';

interface DynamicIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

// Create a map of icon names to components - includes all icons used in your project
const iconMap = {
  User,
  FileText,
  Users, 
  LayoutGrid,
  UserCog,
  HeartHandshake,
  GraduationCap,
  Laptop,
  ClipboardCheck,
  MessageSquare,
  AlertTriangle,
  Search,
  Edit,
  Trash2,
  Plus,
  PlusCircle,
  Lock,
  UserCircle,
  Database,
  Activity,
  BarChart,
  PieChart,
  Settings,
  Tag,
  RefreshCw,
  X
};

export function DynamicIcon({ iconName, size = 24, className = '' }: DynamicIconProps) {
  // Get the icon component from our predefined map
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback to User icon if the specified icon doesn't exist
  return <User size={size} className={className} />;
}