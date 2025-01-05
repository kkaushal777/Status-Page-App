import React, { useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { io } from 'socket.io-client';

const StatusPage = () => {
  const [status, setStatus] = useState({});
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await axiosInstance.get('/status');
      setStatus(response.data);
    };
    fetchStatus();

    socket.on('status_update', (data) => {
      setStatus(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">System Status</h1>
      <p>Overall Status: {status.overall_status}</p>
      <p>Last Updated: {status.last_updated}</p>
      <div>
        <h2 className="text-xl mb-2">Services</h2>
        <ul>
          {status.services && status.services.map(service => (
            <li key={service.id}>
              {service.name} - {service.status}
              <ul>
                {service.incidents.map(incident => (
                  <li key={incident.id}>
                    {incident.description} ({incident.status})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl mb-2">Incident Count</h2>
        <p>Total: {status.incident_count?.total}</p>
        <p>Ongoing: {status.incident_count?.ongoing}</p>
      </div>
    </div>
  );
};

export default StatusPage;