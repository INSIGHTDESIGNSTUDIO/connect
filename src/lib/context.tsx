import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserNeed, Resource, Role } from '@/types';

// Import mock data directly
import { mockResources, mockRoles, mockNeeds } from './sqlite';

interface AppContextType {
  step: number;
  selectedRoles: UserRole[];
  selectedNeeds: UserNeed[];
  resources: Resource[];
  filteredResources: Resource[];
  searchTerm: string;
  availableRoles: Role[];
  loading?: boolean;

  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  toggleRole: (role: UserRole) => void;
  toggleNeed: (need: UserNeed) => void;
  clearSelections: () => void;
  setSearchTerm: (term: string) => void;
}

const defaultContext: AppContextType = {
  step: 1,
  selectedRoles: [],
  selectedNeeds: [],
  resources: [],
  filteredResources: [],
  searchTerm: '',
  availableRoles: [],

  nextStep: () => {},
  prevStep: () => {},
  setStep: () => {},
  toggleRole: () => {},
  toggleNeed: () => {},
  clearSelections: () => {},
  setSearchTerm: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export function useAppContext() {
  return useContext(AppContext);
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppProviderProps) {
  const [step, setStepState] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<UserNeed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch roles from API
  useEffect(() => {
    async function fetchRoles() {
      try {
        console.log('Fetching roles...');
        const response = await fetch('/api/roles');
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data = await response.json();
        console.log('Fetched roles:', data);
        setAvailableRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Fall back to mock data
        console.warn('Falling back to mock roles data');
        setAvailableRoles(mockRoles);
      }
    }

    fetchRoles();
  }, []);

  // Fetch resources from API
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        console.log('Fetching resources...');
        const response = await fetch('/api/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        console.log('Fetched resources:', data);
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
        // Optionally fall back to mock data
        console.warn('Falling back to mock data');
        setResources(mockResources);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);
  
  const nextStep = () => setStepState(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStepState(prev => Math.max(prev - 1, 1));
  const setStep = (newStep: number) => setStepState(newStep);
  
  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role];

      // When roles change, reset the needs selection
      // as the available needs will change based on roles
      setSelectedNeeds([]);

      return newRoles;
    });
  };
  
  const toggleNeed = (need: UserNeed) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need) 
        : [...prev, need]
    );
  };
  
  const clearSelections = () => {
    setSelectedRoles([]);
    setSelectedNeeds([]);
    setSearchTerm('');
  };
  
  // Filter resources based on selections and search term
  const filteredResources = resources
    .filter(resource => {
      if (selectedRoles.length === 0) return true;
      // Resource roles should be names rather than IDs
      return Array.isArray(resource.roles) &&
        resource.roles.some(role => selectedRoles.includes(role));
    })
    .filter(resource => {
      if (selectedNeeds.length === 0) return true;
      // Resource needs should be names rather than IDs
      return Array.isArray(resource.needs) &&
        resource.needs.some(need => selectedNeeds.includes(need));
    })
    .filter(resource => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        (Array.isArray(resource.tags) && resource.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    });

  
  const value = {
    step,
    selectedRoles,
    selectedNeeds,
    resources,
    filteredResources,
    searchTerm,
    availableRoles,
    loading,

    nextStep,
    prevStep,
    setStep,
    toggleRole,
    toggleNeed,
    clearSelections,
    setSearchTerm,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
