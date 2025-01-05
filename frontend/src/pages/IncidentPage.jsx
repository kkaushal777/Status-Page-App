import React, { useEffect, useState } from 'react';
import { getAllIncidents, createIncident, deleteIncident } from '../services/incidentService';
import Button from '../components/ui/Button';

const IncidentPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [newIncident, setNewIncident] = useState({ description: '', status: '', serviceId: '' });

  useEffect(() => {
    const fetchIncidents = async () => {
      const data = await getAllIncidents();
      setIncidents(data);
    };
    fetchIncidents();
  }, []);

  const handleCreate = async () => {
    const data = await createIncident(newIncident);
    setIncidents([...incidents, data]);
    setNewIncident({ description: '', status: '', serviceId: '' });
  };

  const handleDelete = async (id) => {
    await deleteIncident(id);
    setIncidents(incidents.filter(incident => incident.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Incidents</h1>
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Description" 
          value={newIncident.description} 
          onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })} 
          className="px-3 py-2 border rounded"
        />
        <input 
          type="text" 
          placeholder="Status" 
          value={newIncident.status} 
          onChange={(e) => setNewIncident({ ...newIncident, status: e.target.value })} 
          className="px-3 py-2 border rounded"
        />
        <input 
          type="text" 
          placeholder="Service ID" 
          value={newIncident.serviceId} 
          onChange={(e) => setNewIncident({ ...newIncident, serviceId: e.target.value })} 
          className="px-3 py-2 border rounded"
        />
        <Button onClick={handleCreate}>Add Incident</Button>
      </div>
      <ul>
        {incidents.map(incident => (
          <li key={incident.id} className="flex justify-between items-center mb-2">
            {incident.description} ({incident.status})
            <Button onClick={() => handleDelete(incident.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
    );
}

export default IncidentPage;