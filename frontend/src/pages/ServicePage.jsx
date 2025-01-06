// frontend/src/pages/ServicePage.jsx
import React, { useEffect, useState } from 'react';
import { getAllServices, createService, updateService, deleteService } from '@/services/serviceService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import UptimeGraph from '@/components/ui/UptimeGraph';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axiosInstance';

const SERVICE_STATUSES = ['Operational', 'Degraded', 'Outage'];

const fetchServiceHistory = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/services/${serviceId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service history:', error);
    return [];
  }
};

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [newService, setNewService] = useState({ name: '', status: 'Operational' });
  const [serviceHistories, setServiceHistories] = useState({});
  const { toast } = useToast();
  const { organization } = useAuth();

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        
        if (mounted) {
          setServices(servicesData);
          
          // Fetch history for each service
          const histories = {};
          await Promise.all(
            servicesData.map(async (service) => {
              const history = await fetchServiceHistory(service.id);
              if (mounted) {
                histories[service.id] = history;
              }
            })
          );
          
          if (mounted) {
            setServiceHistories(histories);
          }
        }
      } catch (error) {
        if (mounted) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!organization?.id) {
      toast({
        title: "Error",
        description: "Organization ID is required. Please login again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData = {
        name: newService.name.trim(),
        status: newService.status,
        organization_id: organization.id
      };

      if (!serviceData.name) {
        toast({
          title: "Error",
          description: "Service name is required",
          variant: "destructive",
        });
        return;
      }

      const data = await createService(serviceData);
      setServices(prev => [...prev, data]);
      setNewService({ name: '', status: 'Operational' });
      
      toast({
        title: "Success",
        description: "Service created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (serviceId, newStatus) => {
    try {
      const updatedService = await updateService(serviceId, { status: newStatus });
      
      // Update local state
      setServices(prev => prev.map(service => 
        service.id === serviceId ? updatedService : service
      ));
      
      toast({
        title: "Success",
        description: "Service status updated",
      });
      
      // Socket connection is handled automatically through the backend emit
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await deleteService(serviceToDelete.id);
      setServices(prev => prev.filter(service => service.id !== serviceToDelete.id));
      setServiceToDelete(null);
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
          <CardTitle>Add New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder="Service name"
              required
              className="flex-1"
            />
            <select
              value={newService.status}
              onChange={(e) => setNewService({ ...newService, status: e.target.value })}
              className="px-3 py-2 border rounded min-w-[150px]"
            >
              {SERVICE_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Button type="submit">Add Service</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{service.name}</span>
                  <Badge 
                    variant={
                      service.status === 'Operational' ? 'default' : 
                      service.status === 'Degraded' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {service.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <select
                    value={service.status}
                    onChange={(e) => handleStatusUpdate(service.id, e.target.value)}
                    className="px-3 py-2 border rounded flex-1"
                  >
                    {SERVICE_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <Button 
                    variant="destructive"
                    onClick={() => setServiceToDelete(service)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <UptimeGraph 
              service={service} 
              data={serviceHistories[service.id] || []} 
            />
          </div>
        ))}
      </div>

      <AlertDialog open={!!serviceToDelete} onOpenChange={() => setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {serviceToDelete?.name} and all associated incidents.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicePage;
