// frontend/src/pages/ServicePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { getAllServices, createService, updateService, deleteService } from '@/services/serviceService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
import { useAuth } from '@/hooks/use-auth';

const SERVICE_STATUSES = ['Operational', 'Degraded', 'Outage'];

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [newService, setNewService] = useState({ name: '', status: 'Operational' });
  const { toast } = useToast();
  const { organization } = useAuth();

  const fetchServices = useCallback(async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreate = async (e) => {
    e.preventDefault(); // Ensure this is present to prevent default form submission

    if (!organization) {
      toast({
        title: "Error",
        description: "Organization ID is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviceData = {
        ...newService,
        organization_id: organization.id
      };

      if (!serviceData.name.trim()) {
        toast({
          title: "Error",
          description: "Service name is required",
          variant: "destructive",
        });
        return;
      }

      // Call the API
      const data = await createService(serviceData);
      
      // Update local state
      setServices(prev => [...prev, data]);
      
      // Reset form
      setNewService({ name: '', status: 'Operational' });
      
      // Show success message
      toast({
        title: "Success",
        description: "Service created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (serviceId, newStatus) => {
    try {
      const updatedService = await updateService(serviceId, { status: newStatus });
      setServices(prev => prev.map(service => 
        service.id === serviceId ? updatedService : service
      ));
      toast({
        title: "Success",
        description: "Service status updated",
      });
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
          <Card key={service.id}>
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
