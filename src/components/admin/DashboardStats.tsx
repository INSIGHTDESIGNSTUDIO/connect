import React from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Resource } from '@/types';
import { STYLE_COLORS } from '@/lib/styleGuide';

// Register the required chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type DashboardStatsProps = {
  resources: Resource[];
  roles: any[];
  needs: any[];
};

function DashboardStats({ resources, roles, needs }: DashboardStatsProps) {
  // Generate data for resource types chart
  const resourceTypeData = React.useMemo(() => {
    const typeCount: Record<string, number> = {};
    resources.forEach(resource => {
      const type = resource.resourceType || 'Uncategorized';
      typeCount[type] = (typeCount[type] || 0) + 1;
    }); // Fixed: Removed the misplaced export statement
    
    return {
      labels: Object.keys(typeCount),
      datasets: [
        {
          label: 'Resources by Type',
          data: Object.values(typeCount),
          backgroundColor: [
            `${STYLE_COLORS.darkPurple}cc`, // with transparency
            `${STYLE_COLORS.teal}cc`,
            `${STYLE_COLORS.orange}cc`,
            `${STYLE_COLORS.burgundy}cc`,
            `${STYLE_COLORS.lightBlue}cc`,
            `${STYLE_COLORS.darkPurple}99`,
            `${STYLE_COLORS.teal}99`,
          ],
          borderColor: [
            STYLE_COLORS.darkPurple,
            STYLE_COLORS.teal,
            STYLE_COLORS.orange,
            STYLE_COLORS.burgundy,
            STYLE_COLORS.lightBlue,
            STYLE_COLORS.darkPurple,
            STYLE_COLORS.teal,
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [resources]);

  // Generate data for resources by role
  const resourcesByRoleData = React.useMemo(() => {
    const roleCounts: Record<string, number> = {};
    const roleNames = roles.reduce((acc: Record<string, string>, role) => {
      acc[role.id] = role.name;
      return acc;
    }, {});
    
    // Initialize with all roles at 0
    roles.forEach(role => {
      roleCounts[role.name] = 0;
    });
    
    // Count resources for each role
    resources.forEach(resource => {
      (resource.roles || []).forEach(roleId => {
        const roleName = typeof roleId === 'string' ? 
          (roleNames[roleId] || roleId) : roleId;
        roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
      });
    });
    
    return {
      labels: Object.keys(roleCounts),
      datasets: [
        {
          label: 'Resources by Role',
          data: Object.values(roleCounts),
          backgroundColor: `${STYLE_COLORS.teal}99`,
          borderColor: STYLE_COLORS.teal,
          borderWidth: 1,
        },
      ],
    };
  }, [resources, roles]);

  // Generate data for resources by need
  const resourcesByNeedData = React.useMemo(() => {
    const needCounts: Record<string, number> = {};
    const needNames = needs.reduce((acc: Record<string, string>, need) => {
      acc[need.id] = need.name;
      return acc;
    }, {});
    
    // Initialize with all needs at 0
    needs.forEach(need => {
      needCounts[need.name] = 0;
    });
    
    // Count resources for each need
    resources.forEach(resource => {
      (resource.needs || []).forEach(needId => {
        const needName = typeof needId === 'string' ? 
          (needNames[needId] || needId) : needId;
        needCounts[needName] = (needCounts[needName] || 0) + 1;
      });
    });
    
    return {
      labels: Object.keys(needCounts),
      datasets: [
        {
          label: 'Resources by Need',
          data: Object.values(needCounts),
          backgroundColor: `${STYLE_COLORS.darkPurple}99`,
          borderColor: STYLE_COLORS.darkPurple,
          borderWidth: 1,
        },
      ],
    };
  }, [resources, needs]);

  // Generate data for tags chart
  const tagsChartData = React.useMemo(() => {
    // Count occurrences of each tag
    const tagCount: Record<string, number> = {};

    resources.forEach(resource => {
      (resource.tags || []).forEach(tag => {
        if (tag) {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      });
    });

    // Sort tags by count (descending) and take top 8 for readability
    const sortedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // If we have more tags than we're showing, add an "Others" category
    const otherTagsCount = Object.entries(tagCount).length > 8
      ? Object.entries(tagCount)
          .sort((a, b) => b[1] - a[1])
          .slice(8)
          .reduce((sum, [_, count]) => sum + count, 0)
      : 0;

    // Prepare labels and data
    const labels = sortedTags.map(([tag]) => tag);
    const data = sortedTags.map(([_, count]) => count);

    // Add "Others" if needed
    if (otherTagsCount > 0) {
      labels.push('Others');
      data.push(otherTagsCount);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Tags Used',
          data,
          backgroundColor: [
            `${STYLE_COLORS.darkPurple}cc`,
            `${STYLE_COLORS.teal}cc`,
            `${STYLE_COLORS.orange}cc`,
            `${STYLE_COLORS.burgundy}cc`,
            `${STYLE_COLORS.lightBlue}cc`,
            `${STYLE_COLORS.darkPurple}99`,
            `${STYLE_COLORS.teal}99`,
            `${STYLE_COLORS.orange}99`,
            `${STYLE_COLORS.burgundy}99`,
          ],
          borderColor: [
            STYLE_COLORS.darkPurple,
            STYLE_COLORS.teal,
            STYLE_COLORS.orange,
            STYLE_COLORS.burgundy,
            STYLE_COLORS.lightBlue,
            STYLE_COLORS.darkPurple,
            STYLE_COLORS.teal,
            STYLE_COLORS.orange,
            STYLE_COLORS.burgundy,
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [resources]);

  // Recent activity data (for demonstration - in a real app this would come from an activity log)
  const recentActivity = React.useMemo(() => {
    // Sort resources by updatedAt date (descending)
    const sortedResources = [...resources].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // Get the 5 most recently updated resources
    return sortedResources.slice(0, 5);
  }, [resources]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource types pie chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Resource Types</h3>
          <div className="h-64">
            <Pie
              data={resourceTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Tags distribution doughnut chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Tags Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={tagsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((resource) => (
                <div key={resource.id} className="flex items-center p-2 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: STYLE_COLORS.teal }}></div>
                  <div className="flex-1">
                    <div className="font-medium">{resource.title}</div>
                    <div className="text-xs text-gray-500">
                      Updated {new Date(resource.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {resource.resourceType}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No recent activity</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resources by role bar chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Resources by Role</h3>
          <div className="h-64">
            <Bar
              data={resourcesByRoleData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Resources by need bar chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Resources by Need</h3>
          <div className="h-64">
            <Bar
              data={resourcesByNeedData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;