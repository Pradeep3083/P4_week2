import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authorized');
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          setError('Not authorized');
          return;
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authorized');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status } : order
        ));
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Items</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-2 px-4 border-b">{order._id}</td>
                    <td className="py-2 px-4 border-b">{order.customer}</td>
                    <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">${order.total.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} x {item.quantity} (${item.price.toFixed(2)})
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipCode}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleStatusChange(order._id, 'Shipped')}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => handleStatusChange(order._id, 'Delivered')}
                        className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-2 px-4 border-b text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;