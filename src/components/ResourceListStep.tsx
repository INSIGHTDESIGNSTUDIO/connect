import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Button } from './ui/Button';
import { ResourceCard } from './ResourceCard';
import { Search, Tag, RefreshCw, X } from 'lucide-react';

export function ResourceListStep() {
  const { 
    filteredResources, 
    resources,
    searchTerm, 
    setSearchTerm, 
    selectedRoles, 
    selectedNeeds,
    prevStep,
    clearSelections
  } = useAppContext();

  const [showFilters, setShowFilters] = useState(false);
  // Add new state for filter toggles
  const [enabledFilters, setEnabledFilters] = useState({
    roles: true,
    needs: true,
    search: true
  });

  // Create a new filtered resources list based on enabled filters
  const getFilteredResources = () => {
    return resources
      .filter(resource => {
        // Apply role filter only if it's enabled
        if (enabledFilters.roles && selectedRoles.length > 0) {
          if (!Array.isArray(resource.roles)) return false;
          if (!resource.roles.some(role => selectedRoles.includes(role))) return false;
        }
        
        // Apply needs filter only if it's enabled
        if (enabledFilters.needs && selectedNeeds.length > 0) {
          if (!Array.isArray(resource.needs)) return false;
          if (!resource.needs.some(need => selectedNeeds.includes(need))) return false;
        }
        
        // Apply search filter only if it's enabled
        if (enabledFilters.search && searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesSearch = 
            resource.title.toLowerCase().includes(term) ||
            resource.description.toLowerCase().includes(term) ||
            (Array.isArray(resource.tags) && resource.tags.some(tag => tag.toLowerCase().includes(term)));
          
          if (!matchesSearch) return false;
        }
        
        return true;
      });
  };

  const displayedResources = getFilteredResources();

  // Toggle individual filters
  const toggleFilter = (filterName: 'roles' | 'needs' | 'search') => {
    setEnabledFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Resources</h1>
        <p className="text-gray-600">
          We found {displayedResources.length} resources based on your selections
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!enabledFilters.search}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full"
          >
            <Tag className="mr-2 h-4 w-4" /> 
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="ghost"
            onClick={clearSelections}
            className="sm:w-auto w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        {showFilters && (
          <div className="bg-muted p-4 rounded-md mb-4">
            <div className="flex flex-wrap justify-between items-center mb-3">
              <h3 className="font-medium">Filter Controls</h3>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button 
                  size="sm" 
                  variant={enabledFilters.roles ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => toggleFilter('roles')}
                >
                  {enabledFilters.roles ? (
                    <>Roles <X className="ml-1 h-3 w-3" /></>
                  ) : (
                    'Enable Roles'
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant={enabledFilters.needs ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => toggleFilter('needs')}
                >
                  {enabledFilters.needs ? (
                    <>Needs <X className="ml-1 h-3 w-3" /></>
                  ) : (
                    'Enable Needs'
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant={enabledFilters.search ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => toggleFilter('search')}
                >
                  {enabledFilters.search ? (
                    <>Search <X className="ml-1 h-3 w-3" /></>
                  ) : (
                    'Enable Search'
                  )}
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Your Selected Roles:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.length > 0 ? (
                  selectedRoles.map(role => (
                    <span 
                      key={role} 
                      className={`px-2 py-1 text-sm rounded-md ${
                        enabledFilters.roles 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">No roles selected</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Your Selected Needs:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNeeds.length > 0 ? (
                  selectedNeeds.map(need => (
                    <span 
                      key={need} 
                      className={`px-2 py-1 text-sm rounded-md ${
                        enabledFilters.needs 
                          ? 'bg-secondary/10 text-secondary' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {need}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">No needs selected</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {displayedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find more resources
          </p>
          <Button onClick={clearSelections}>Clear All Filters</Button>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button 
          onClick={prevStep}
          variant="outline"
          className="px-8"
        >
          Back to Needs
        </Button>
      </div>
    </div>
  );
}