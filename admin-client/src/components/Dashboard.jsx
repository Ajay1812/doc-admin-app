import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/patients">View Patients</Link>
          </li>
          <li>
            <Link to="/invoices">View Invoices</Link>
          </li>
          <li>
            <Link to="/appointments">View Appointments</Link>
          </li>
          <li>
            <Link to="/treatments">View Treatments</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

