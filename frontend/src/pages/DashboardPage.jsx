import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAllServices } from '@/services/serviceService';
import { getAllIncidents } from '@/services/incidentService';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    services: [],
    incidents: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [services, incidents] = await Promise.all([
          getAllServices(),
          getAllIncidents()
        ]);

        setStats({
          services,
          incidents,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.services.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.incidents.filter(i => !i.resolved).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(
                (stats.services.filter(s => s.status === 'Operational').length / 
                stats.services.length) * 100
              )}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.incidents.slice(0, 5).map(incident => (
              <div key={incident.id} className="mb-4 p-4 border rounded">
                <p className="font-semibold">{incident.description}</p>
                <p className="text-sm text-gray-500">
                  Status: {incident.status}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(incident.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.services.map(service => (
              <div key={service.id} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{service.name}</p>
                  <span className={`px-2 py-1 rounded text-sm ${
                    service.status === 'Operational' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;