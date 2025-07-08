import React, { useState } from 'react';
import {
  Search, FileText, Users, LayoutGrid, UserCog, HeartHandshake,
  GraduationCap, Laptop, ClipboardCheck, MessageSquare, AlertTriangle,
  User, UserPlus, UserCheck, Book, BookOpen, BookmarkPlus, Library,
  School, PenTool, Pencil, FilePlus, FileCheck, Files, Briefcase,
  Building, Landmark, Home, Star, Heart, Award, Monitor, Smartphone,
  Tablet, Mail, Bell, Calendar, Code, Terminal, Brackets, Database,
  Brain, Lightbulb, Zap, Sparkles, Target, Compass, Map, Globe,
  Palette, PaintBucket, Brush, Ruler, ShoppingCart, Tag, Package,
  Gift, Music, Film, Camera, Image, Coffee, Utensils, Apple,
  Activity, BookText, BookOpenText, CheckCircle
} from 'lucide-react';

// Define a list of common icons to choose from
const COMMON_ICONS = [
  'User', 'Users', 'UserPlus', 'UserCheck',
  'Book', 'BookOpen', 'BookmarkPlus', 'Library',
  'GraduationCap', 'School', 'PenTool', 'Pencil',
  'FileText', 'FilePlus', 'FileCheck', 'Files',
  'Briefcase', 'Building', 'Landmark', 'Home',
  'Star', 'Heart', 'Award', 'Monitor',
  'Laptop', 'Smartphone', 'Tablet',
  'Mail', 'MessageSquare', 'Bell', 'Calendar',
  'Code', 'Terminal', 'Brackets', 'Database',
  'Brain', 'Lightbulb', 'Zap', 'Sparkles',
  'Target', 'Compass', 'Map', 'Globe',
  'Palette', 'PaintBucket', 'Brush', 'Ruler',
  'ShoppingCart', 'Tag', 'Package', 'Gift',
  'Music', 'Film', 'Camera', 'Image',
  'Coffee', 'Utensils', 'Apple',
  'Activity', 
  'BookText', 'BookOpenText', 'ClipboardCheck', 'CheckCircle'
];

// Create a map of icon names to components
const iconComponentMap = {
  User, Users, UserPlus, UserCheck, Book, BookOpen, BookmarkPlus, Library,
  GraduationCap, School, PenTool, Pencil, FileText, FilePlus, FileCheck, Files,
  Briefcase, Building, Landmark, Home, Star, Heart, Award, Monitor,
  Laptop, Smartphone, Tablet, Mail, MessageSquare, Bell, Calendar,
  Code, Terminal, Brackets, Database, Brain, Lightbulb, Zap, Sparkles,
  Target, Compass, Map, Globe, Palette, PaintBucket, Brush, Ruler,
  ShoppingCart, Tag, Package, Gift, Music, Film, Camera, Image,
  Coffee, Utensils, Apple, Activity, BookText, BookOpenText, 
  ClipboardCheck, CheckCircle
};

// Create a static typed icon map to avoid dynamic access issues
const ICON_MAP: Record<string, JSX.Element> = {};
COMMON_ICONS.forEach(name => {
  const IconComponent = iconComponentMap[name as keyof typeof iconComponentMap];
  if (IconComponent) {
    ICON_MAP[name] = <IconComponent size={24} />;
  }
});

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter icons based on search term
  const filteredIcons = searchTerm
    ? COMMON_ICONS.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase()))
    : COMMON_ICONS;

  // Get the selected icon element
  const selectedIconElement = ICON_MAP[selectedIcon] || ICON_MAP['User'];

  return (
    <div className="relative icon-selector">
      <label className="block text-sm font-medium mb-1" htmlFor="icon-search">
        Icon
      </label>
      
      {/* Selected icon display / dropdown trigger */}
      <div 
        className="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-2 text-gray-700">
          {selectedIconElement}
        </div>
        <span className="flex-grow">{selectedIcon || 'User'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-96 overflow-auto">
          {/* Search input */}
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="icon-search"
                className="w-full pl-10 py-2 pr-3 border rounded-md"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Icons grid */}
          <div className="grid grid-cols-4 gap-2 p-2">
            {filteredIcons.map((iconName) => (
              <div
                key={iconName}
                className={`flex flex-col items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  selectedIcon === iconName ? 'bg-blue-100 border border-blue-300' : ''
                }`}
                onClick={() => {
                  onSelectIcon(iconName);
                  setIsOpen(false);
                }}
              >
                <div>{ICON_MAP[iconName]}</div>
                <span className="mt-1 text-xs truncate w-full text-center">{iconName}</span>
              </div>
            ))}
            {filteredIcons.length === 0 && (
              <div className="col-span-4 p-4 text-center text-gray-500">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}