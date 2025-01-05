import React, { useEffect, useState } from 'react';
import { getAllServices, createService, deleteService } from '../services/serviceService';
import Button from '../components/ui/Button';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getAllServices();
      setServices(data);
    };
    fetchServices();
  }, []);

  const handleCreate = async () => {
    const data = await createService({ name: newService });
    setServices([...services, data]);
    setNewService('');
  };

  const handleDelete = async (id) => {
    await deleteService(id);
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Services</h1>
      <div className="mb-4">
        <input 
          type="text" 
          value={newService} 
          onChange={(e) => setNewService(e.target.value)} 
          className="px-3 py-2 border rounded"
        />
        <Button onClick={handleCreate}>Add Service</Button>
      </div>
      <ul>
        {services.map(service => (
          <li key={service.id} className="flex justify-between items-center mb-2">
            {service.name}
            <Button onClick={() => handleDelete(service.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicePage;