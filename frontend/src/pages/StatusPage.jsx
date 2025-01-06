import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import socketService from './socketService';
import axiosInstance from '@/lib/axiosInstance';

const StatusIndicator = ({ status }) => {
  const icons = {
    Operational: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    Degraded: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    Outage: <XCircle className="h-5 w-5 text-red-500" />
  };

  const colors = {
    Operational: 'bg-green-100 text-green-800 border-green-200',
    Degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Outage: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${colors[status]}`}>
      {icons[status]}
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

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
    
    // Connect to WebSocket and listen for updates
    const socket = socketService.connect();
    
    socket.on('service_status_changed', (updatedService) => {
      setStatus(prevStatus => ({
        ...prevStatus,
        services: prevStatus.services.map(service =>
          service.id === updatedService.service_id
            ? { ...service, status: updatedService.status }
            : service
        )
      }));

      toast({
        title: "Status Updated",
        description: `${updatedService.name} status changed to ${updatedService.status}`,
      });
    });

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">System Status</h1>
        <p className="text-muted-foreground">
          Current status as of {status?.last_updated && new Date(status.last_updated).toLocaleString()}
        </p>
      </div>

      <Card className="mb-8 border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6">
            <StatusIndicator status={status?.overall_status || 'Unknown'} />
            <p className="mt-4 text-muted-foreground">
              {status?.overall_status === 'Operational' 
                ? 'All systems are operational'
                : 'Some systems are experiencing issues'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {status?.services?.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <StatusIndicator status={service.status} />
              </div>
            </CardHeader>
            {service.incidents?.length > 0 && (
              <CardContent className="mt-4">
                <div className="space-y-4">
                  {service.incidents.map((incident) => (
                    <div 
                      key={incident.id} 
                      className="bg-muted/30 rounded-lg p-4 border border-border/50"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-medium mb-1">{incident.description}</h4>
                          <time className="text-sm text-muted-foreground">
                            {new Date(incident.created_at).toLocaleString()}
                          </time>
                        </div>
                        <Badge variant={incident.resolved ? 'outline' : 'destructive'}>
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {status?.incident_count && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{status.incident_count.total}</div>
              <div className="text-sm text-muted-foreground">Total Incidents</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{status.incident_count.ongoing}</div>
              <div className="text-sm text-muted-foreground">Ongoing Incidents</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;