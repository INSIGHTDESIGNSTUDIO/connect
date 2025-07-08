import { useEffect, useState } from 'react';
import { UserNeed, Role } from '@/types';
import { SelectionCard } from './SelectionCard';
import { useAppContext } from '@/lib/context';
import { Button } from './ui/Button';
import { DynamicIcon } from './DynamicIcon';
import { 
  FileText, 
  LayoutGrid, 
  HeartHandshake, 
  GraduationCap, 
  Laptop, 
  ClipboardCheck, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react';

// Import mock data for client-side fallback
import { mockNeeds } from '@/lib/sqlite';

interface NeedItem {
  need: UserNeed;
  icon: React.ReactNode;
  description: string;
}

// Define the shape of the need object returned from the API
interface NeedData {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function NeedSelectionStep() {
  const { selectedNeeds, selectedRoles, availableRoles, toggleNeed, nextStep, prevStep } = useAppContext();
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noMatchingNeeds, setNoMatchingNeeds] = useState(false);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        setLoading(true);
        
        // Fetch all needs with their roles from API
        const response = await fetch('/api/needs');
        if (!response.ok) {
          throw new Error('Failed to fetch needs');
        }
        
        const allNeeds: NeedData[] = await response.json();
        console.log('All needs from DB:', allNeeds);
        
        // Always show all needs regardless of selected roles
        // This ensures needs are displayed even if they don't match the selected role
        const formattedNeeds = allNeeds.map((need: NeedData) => ({
          need: need.name as UserNeed,
          icon: <DynamicIcon iconName={need.icon} />,
          description: need.description
        }));
        
        setNeeds(formattedNeeds);
        setNoMatchingNeeds(formattedNeeds.length === 0);
      } catch (error) {
        console.error('Error fetching needs:', error);
        // Fallback to default needs if there's an error
        setNeeds(getDefaultNeeds());
      } finally {
        setLoading(false);
      }
    };
    
    fetchNeeds();
  }, [selectedRoles, availableRoles]);
  
  // Default needs for fallback if database fetch fails
  const getDefaultNeeds = (): NeedItem[] => [
    { 
      need: 'Teaching Resources', 
      icon: <FileText />, 
      description: 'Materials to support your teaching practice'
    },
    { 
      need: 'Unit Development', 
      icon: <LayoutGrid />, 
      description: 'Tools for curriculum and course design'
    },
    { 
      need: 'Student Support', 
      icon: <HeartHandshake />, 
      description: 'Strategies for supporting diverse student needs'
    },
    { 
      need: 'Professional Development', 
      icon: <GraduationCap />, 
      description: 'Opportunities to enhance your teaching skills'
    },
    { 
      need: 'Technology', 
      icon: <Laptop />, 
      description: 'Digital tools to enhance teaching and learning'
    },
    { 
      need: 'Assessment', 
      icon: <ClipboardCheck />, 
      description: 'Design and implement effective assessments'
    },
    { 
      need: 'Feedback', 
      icon: <MessageSquare />, 
      description: 'Providing constructive feedback to students'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">What do you need help with?</h1>
        <p className="text-gray-600">Select the areas you're interested in to personalise your resource list</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading needs...</p>
        </div>
      ) : noMatchingNeeds ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100 p-6">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No needs found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any needs in the database. Please contact the administrator.
          </p>
          <Button
            onClick={prevStep}
            variant="outline"
            className="px-8"
          >
            Back to Roles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {needs.map(({ need, icon, description }) => (
            <SelectionCard
              key={need}
              title={need}
              icon={icon}
              description={description}
              selected={selectedNeeds.includes(need)}
              onClick={() => toggleNeed(need)}
            />
          ))}
        </div>
      )}
      
      {!loading && !noMatchingNeeds && (
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="px-8"
          >
            Back
          </Button>
          <Button 
            onClick={nextStep}
            className="px-8"
            disabled={selectedNeeds.length === 0}
          >
            View Resources
          </Button>
        </div>
      )}
    </div>
  );
}
