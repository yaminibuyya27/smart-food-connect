import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/UIComponents';
import { Users, Package, Bell, ShoppingCart, TrendingUp, AlertCircle, FileText } from 'lucide-react';

const AdminDashboardView = ({ currentUser }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // @ts-ignore - Vite env variable
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        headers: {
          'user-id': currentUser._id
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card className="">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of Smart Food Connect platform</p>
      </div>

      {stats && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" /> User Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                icon={Users}
                color="text-blue-600"
                description="All registered users"
              />
              <StatCard
                title="Shoppers"
                value={stats.users.shoppers}
                icon={Users}
                color="text-green-600"
                description="Active shoppers"
              />
              <StatCard
                title="Retailers"
                value={stats.users.retailers}
                icon={Users}
                color="text-purple-600"
                description="Food retailers"
              />
              <StatCard
                title="Charities"
                value={stats.users.charities}
                icon={Users}
                color="text-red-600"
                description="Charity organizations"
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="mr-2" /> Inventory Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Items"
                value={stats.inventory.total}
                icon={Package}
                color="text-blue-600"
                description="All inventory items"
              />
              <StatCard
                title="Available Items"
                value={stats.inventory.available}
                icon={Package}
                color="text-green-600"
                description="Currently available"
              />
              <StatCard
                title="Expiring Soon"
                value={stats.inventory.expiringSoon}
                icon={AlertCircle}
                color="text-orange-600"
                description="Within 7 days"
              />
              <StatCard
                title="Charity Items"
                value={stats.inventory.charityItems}
                icon={Package}
                color="text-red-600"
                description="For charities"
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2" /> Activity Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Carts"
                value={stats.carts.total}
                icon={ShoppingCart}
                color="text-blue-600"
                description="All user carts"
              />
              <StatCard
                title="Active Carts"
                value={stats.carts.withItems}
                icon={ShoppingCart}
                color="text-green-600"
                description="Carts with items"
              />
              <StatCard
                title="Notifications"
                value={stats.notifications.total}
                icon={Bell}
                color="text-purple-600"
                description="Total notifications"
              />
              <StatCard
                title="Active Alerts"
                value={stats.notifications.active}
                icon={Bell}
                color="text-orange-600"
                description="Pending notifications"
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" /> Order Statistics
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Orders"
                value={stats.orders.total}
                icon={FileText}
                color="text-blue-600"
                description="All orders"
              />
              <StatCard
                title="Pending Orders"
                value={stats.orders.pending}
                icon={FileText}
                color="text-orange-600"
                description="Awaiting processing"
              />
              <StatCard
                title="Completed Orders"
                value={stats.orders.completed}
                icon={FileText}
                color="text-green-600"
                description="Successfully completed"
              />
            </div>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">User Engagement Rate</span>
                  <span className="text-green-600 font-semibold">
                    {stats.carts.total > 0
                      ? ((stats.carts.withItems / stats.carts.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Inventory Availability</span>
                  <span className="text-green-600 font-semibold">
                    {stats.inventory.total > 0
                      ? ((stats.inventory.available / stats.inventory.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Items Expiring Soon</span>
                  <span className={`font-semibold ${stats.inventory.expiringSoon > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {stats.inventory.expiringSoon} items
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboardView;
