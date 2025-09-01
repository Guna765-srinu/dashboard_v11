import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/context/DashboardContext';

const chartStyle = { filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))' };

const TechnologyChart = () => {
  const { isLoading, filteredData, columnMapping, columnLabels, selectTicketsByCategory } = useDashboard();

  const technologyData = React.useMemo(() => {
    if (!filteredData) return [];
    const { prepareCategoryData } = require('@/utils/dataProcessor');
    return prepareCategoryData(filteredData, 'technology', columnLabels, columnMapping);
  }, [filteredData, columnLabels, columnMapping]);

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      selectTicketsByCategory('technology', data.activeLabel);
    }
  };

  if (!columnMapping.technology) return null;

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>{columnLabels.technology || 'Technology'}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={technologyData}
              margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
              style={chartStyle}
              onClick={handleBarClick}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 16, fill: 'hsl(var(--foreground))' }}
                angle={-30}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
              <Bar
                dataKey="value"
                fill="url(#barColor)"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="hsl(var(--foreground))"
                  fontSize={17}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnologyChart;
