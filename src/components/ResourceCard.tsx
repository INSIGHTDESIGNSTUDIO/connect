// src/components/ResourceCard.tsx
import { Resource } from '@/types';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from './ui/Card';
import { cn } from '@/lib/utils';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const { title, description, url, featured, updatedAt, resourceType, tags, actionText } = resource;

  // Default action text if not provided
  const displayActionText = actionText || "View Resource";

  // indexable map so TS won't complain
  const typeColorMap: Record<string, string> = {
    Guide:    'bg-education-100 text-education-700',
    Video:    'bg-education-100 text-education-700',
    Template: 'bg-knowledge-100 text-knowledge-700',
    Tool:     'bg-knowledge-100 text-knowledge-700',
    Article:  'bg-education-100 text-education-700',
    Workshop: 'bg-knowledge-100 text-knowledge-700',
  };

  const typeColor = typeColorMap[resourceType] || 'bg-gray-100 text-gray-700';

  return (
    <Card className={cn('transition-shadow duration-300 hover:shadow-md', featured ? 'border-l-4 border-l-primary' : '', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span className={cn('inline-block px-2 py-1 text-xs font-medium rounded-md mb-2', typeColor)}>
              {resourceType}
            </span>
            {featured && (
              <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">
                Featured
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Updated: {new Date(updatedAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <a href={url} className="text-primary hover:underline text-sm font-medium" target="_blank" rel="noopener noreferrer">
          {displayActionText} →
        </a>
      </CardFooter>
    </Card>
  );
}