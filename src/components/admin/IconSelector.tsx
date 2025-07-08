import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [iconMap, setIconMap] = useState<Record<string, any>>({});
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  
  // Dynamically import and render icons to avoid SSR issues
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('lucide-react').then((LucideIcons) => {
      const map: Record<string, any> = {};
      Object.keys(LucideIcons).forEach((key) => {
        // Skip the default export
        if (key !== 'default') {
          map[key] = LucideIcons[key];
        }
      });
      setIconMap(map);
      
      // Initialize filtered icons
      setFilteredIcons(Object.keys(map));
    });
  }, []);
  
  // Filter icons when search term changes
  useEffect(() => {
    if (Object.keys(iconMap).length === 0) return;
    
    if (!searchTerm) {
      setFilteredIcons(Object.keys(iconMap));
    } else {
      const filtered = Object.keys(iconMap).filter((iconName) =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIcons(filtered);
    }
  }, [iconMap, searchTerm]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.icon-selector')) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Render the selected icon element
  const renderSelectedIcon = () => {
    if (!selectedIcon || !iconMap[selectedIcon]) {
      // Render a placeholder if no icon is selected
      return <div className="w-6 h-6 mr-2 border border-dashed border-gray-400 rounded flex items-center justify-center"></div>;
    }
    
    const IconComponent = iconMap[selectedIcon];
    // Ensure we return a JSX element
    return IconComponent ? <IconComponent className="mr-2 text-gray-700" size={24} /> : null;
  };
  
  // Render an icon in the dropdown
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={24} /> : null;
  };

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
        {renderSelectedIcon()}
        <span className="flex-grow">{selectedIcon || 'Select an icon'}</span>
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
                {renderIcon(iconName)}
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