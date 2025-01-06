import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import socketService from './socketService';
import axiosInstance from '@/lib/axiosInstance';

const StatusPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/status');
        setStatus(response.data);
      } catch (error) {
        console.error('Error fetching status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    socketService.connect();
    socketService.subscribe('status_update', (data) => {
      setStatus(data);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Status
            {status && (
              <Badge variant={status.overall_status === 'Operational' ? 'default' : 'destructive'}>
                {status.overall_status}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Last updated: {status?.last_updated && new Date(status.last_updated).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {status?.services?.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {service.name}
                <Badge variant={service.status === 'Operational' ? 'default' : 'destructive'}>
                  {service.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            {service.incidents?.length > 0 && (
              <CardContent>
                <h4 className="text-sm font-semibold mb-2">Recent Incidents</h4>
                <div className="space-y-2">
                  {service.incidents.map((incident) => (
                    <div key={incident.id} className="text-sm p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{incident.description}</span>
                        <Badge variant={incident.resolved ? 'default' : 'destructive'}>
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(incident.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {status?.incident_count && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Total Incidents: {status.incident_count.total}</p>
          <p>Ongoing Incidents: {status.incident_count.ongoing}</p>
        </div>
      )}
    </div>
  );
};

export default StatusPage;