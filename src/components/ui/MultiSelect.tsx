import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  className,
  label,
  required = false
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options);
      return;
    }
    
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim() && !options.some(o => o.value === searchTerm)) {
      // Add as new option
      const newOption = { value: searchTerm, label: searchTerm };
      options.push(newOption);
      toggleOption(searchTerm);
      setSearchTerm('');
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
          {selectedValues.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">
              ({selectedValues.length} selected)
            </span>
          )}
        </label>
      )}
      
      <div 
        ref={containerRef}
        className={cn(
          "relative",
          className
        )}
      >
        <div
          className={cn(
            "flex flex-wrap gap-1 p-2 border rounded-md cursor-pointer bg-white min-h-10",
            isOpen && "ring-2 ring-blue-400",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedValues.map(value => {
              const option = options.find(o => o.value === value);
              return (
                <span 
                  key={value}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                >
                  {option?.label || value}
                  <button 
                    onClick={(e) => removeOption(value, e)}
                    className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              );
            })
          )}
          <div className="ml-auto self-center">
            <ChevronDown size={16} className={cn("transform transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or add new..."
                className="w-full p-1.5 border rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results found. Press Enter to add "{searchTerm}"
                </div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-3 py-2 cursor-pointer flex items-center hover:bg-gray-100",
                      selectedValues.includes(option.value) && "bg-blue-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
                    }}
                  >
                    <div className={cn(
                      "w-5 h-5 border rounded-sm mr-2 flex items-center justify-center",
                      selectedValues.includes(option.value) 
                        ? "bg-blue-500 border-blue-500" 
                        : "border-gray-300"
                    )}>
                      {selectedValues.includes(option.value) && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}