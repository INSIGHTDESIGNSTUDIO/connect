import React from 'react';
import { useRouter } from 'next/router';
import { FileText, Users, LayoutGrid, UserCog, Database } from 'lucide-react';
import { SECTION_COLORS } from '@/lib/styleGuide';

interface AdminHeaderProps {
  activeSection?: 'dashboard' | 'resources' | 'roles' | 'needs' | 'users' | 'data-management';
}

export function AdminHeader({ activeSection = 'dashboard' }: AdminHeaderProps) {
  const router = useRouter();

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      active: activeSection === 'dashboard',
      color: SECTION_COLORS.dashboard
    },
    { 
      name: 'Resources', 
      path: '/admin/resources', 
      icon: <FileText className="w-4 h-4" />, 
      active: activeSection === 'resources',
      color: SECTION_COLORS.resources
    },
    { 
      name: 'Roles', 
      path: '/admin/roles', 
      icon: <Users className="w-4 h-4" />, 
      active: activeSection === 'roles',
      color: SECTION_COLORS.roles
    },
    { 
      name: 'Needs', 
      path: '/admin/needs', 
      icon: <LayoutGrid className="w-4 h-4" />, 
      active: activeSection === 'needs',
      color: SECTION_COLORS.needs
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: <UserCog className="w-4 h-4" />, 
      active: activeSection === 'users',
      color: SECTION_COLORS.users
    },
    { 
      name: 'Data Management', 
      path: '/admin/data-management', 
      icon: <Database className="w-4 h-4" />, 
      active: activeSection === 'data-management',
      color: SECTION_COLORS.dashboard
    }
  ];

  return (
    <div className="bg-white shadow mb-6 rounded-md">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`px-4 py-4 flex items-center space-x-2 font-medium text-sm transition-colors relative ${
                item.active 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ 
                borderBottom: item.active ? `2px solid ${item.color}` : '2px solid transparent' 
              }}
            >
              {item.icon && item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}