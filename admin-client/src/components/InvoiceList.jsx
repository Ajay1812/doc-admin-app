// src/components/InvoiceList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/admin/invoices', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setInvoices(response.data.invoices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Invoices List</h2>
      <ul>
        {invoices.map(invoice => (
          <li key={invoice._id}>
            Invoice ID: {invoice._id} - Total Amount: {invoice.totalAmount} - Status: {invoice.paymentStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

