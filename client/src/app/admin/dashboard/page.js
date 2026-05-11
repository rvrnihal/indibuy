'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingCart, FiBox, FiBarChart3, FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiLogOut, FiSettings } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/lib/api';
import Link from 'next/link';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [dashRes, usersRes, vendorsRes, productsRes, ticketsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/vendors'),
        api.get('/admin/products'),
        api.get('/admin/support-tickets')
      ]);

      setDashboardStats(dashRes.data.data);
      setUsers(usersRes.data.data || []);
      setVendors(vendorsRes.data.data || []);
      setProducts(productsRes.data.data || []);
      setTickets(ticketsRes.data.data || []);

      // Mock analytics
      setAnalyticsData([
        { month: 'Jan', users: 4000, orders: 2400, revenue: 240000 },
        { month: 'Feb', users: 3000, orders: 1398, revenue: 221210 },
        { month: 'Mar', users: 2000, orders: 9800, revenue: 229210 },
        { month: 'Apr', users: 2780, orders: 3908, revenue: 200100 },
        { month: 'May', users: 1890, orders: 4800, revenue: 221800 },
        { month: 'Jun', users: 2390, orders: 3800, revenue: 250400 }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading admin dashboard...</div>;
  }

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
        <div className="text-4xl opacity-20" style={{ color }}><Icon /></div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-red-100 mt-2">Platform Management & Analytics</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/settings" className="flex items-center gap-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg transition">
              <FiSettings /> Settings
            </Link>
            <button className="flex items-center gap-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg transition">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={dashboardStats?.stats?.totalUsers || 0}
            color="#3b82f6"
          />
          <StatCard
            icon={FiShoppingCart}
            label="Total Vendors"
            value={dashboardStats?.stats?.totalVendors || 0}
            color="#10b981"
          />
          <StatCard
            icon={FiBox}
            label="Total Products"
            value={dashboardStats?.stats?.totalProducts || 0}
            color="#f59e0b"
          />
          <StatCard
            icon={FiBarChart3}
            label="Total Orders"
            value={dashboardStats?.stats?.totalOrders || 0}
            color="#8b5cf6"
          />
          <StatCard
            icon={FiBarChart3}
            label="Total Revenue"
            value={`₹${(dashboardStats?.stats?.totalRevenue || 0) / 100000}L`}
            color="#ef4444"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          {['overview', 'users', 'vendors', 'products', 'support'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition whitespace-nowrap ${
                activeTab === tab
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats?.recentOrders?.slice(0, 5).map(order => (
                      <tr key={order._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.buyer?.firstName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.totalAmount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link href={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-800">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">User Management</h3>
              <div className="flex gap-2">
                <input type="text" placeholder="Search users..." className="px-4 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {user.status === 'active' && (
                        <button className="text-red-600 hover:text-red-800 text-xs font-medium">Suspend</button>
                      )}
                      {user.status === 'suspended' && (
                        <button className="text-green-600 hover:text-green-800 text-xs font-medium">Reactivate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Vendor Management</h3>
              <div className="flex gap-2">
                <select className="px-4 py-2 border rounded-lg text-sm">
                  <option>All</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Business Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Products</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{vendor.businessName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vendor.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">-</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {!vendor.isVerified && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-xs font-medium">Approve</button>
                          <button className="text-red-600 hover:text-red-800 text-xs font-medium">Reject</button>
                        </>
                      )}
                      {vendor.isVerified && (
                        <button className="text-red-600 hover:text-red-800 text-xs font-medium">Suspend</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Product Moderation</h3>
              <select className="px-4 py-2 border rounded-lg text-sm">
                <option>All</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vendor</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{product.vendor?.businessName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {product.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-xs font-medium">Approve</button>
                          <button className="text-red-600 hover:text-red-800 text-xs font-medium">Reject</button>
                        </>
                      )}
                      <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Support Tickets</h3>
              <select className="px-4 py-2 border rounded-lg text-sm">
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{ticket.user?.firstName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/tickets/${ticket._id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
