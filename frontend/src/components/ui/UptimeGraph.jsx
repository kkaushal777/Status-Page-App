import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UptimeGraph = ({ service, data }) => {
  // Calculate uptime percentage
  const calculateUptime = (data) => {
    const total = data.length;
    const operational = data.filter(d => d.status === 'Operational').length;
    return ((operational / total) * 100).toFixed(2);
  };

  // Format the graph data
  const formatData = (data) => {
    return data.map(d => ({
      timestamp: new Date(d.timestamp).toLocaleDateString(),
      uptime: d.status === 'Operational' ? 100 : 
              d.status === 'Degraded' ? 50 : 0
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{service.name} Uptime</span>
          <span className="text-sm font-normal">
            {calculateUptime(data)}% Uptime
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatData(data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line 
                type="monotone" 
                dataKey="uptime" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
              />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UptimeGraph;