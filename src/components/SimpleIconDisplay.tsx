import React from 'react';
import { 
  Search, FileText, Users, LayoutGrid, UserCog, HeartHandshake,
  GraduationCap, Laptop, ClipboardCheck, MessageSquare, AlertTriangle, User 
} from 'lucide-react';

interface SimpleIconDisplayProps {
  iconName: string;
  size?: number;
  className?: string;
}

// Create a map of icon names to components
const iconMap = {
  Search,
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
  User
};

// Create a simplified component that safely renders icons
export function SimpleIconDisplay({ iconName, size = 24, className = '' }: SimpleIconDisplayProps) {
  // Get the icon component from our map
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback to User icon if the specified icon doesn't exist
  return <User size={size} className={className} />;
}