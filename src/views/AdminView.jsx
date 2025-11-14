import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '../components/UIComponents';
import { LayoutDashboard, Users, FileText, Package, Bell, ShoppingCart, MapPin } from 'lucide-react';
import AdminDashboardView from './AdminDashboardView';
import AdminUserManagementView from './AdminUserManagementView';
import AdminReportsView from './AdminReportsView';
import MapComponent from '../components/MapComponent';
import { useInventory } from '../context/InventoryContext';

const AdminView = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { inventoryItems } = useInventory();
  // @ts-ignore - Vite env variable
  const API_URL = import.meta.env.VITE_API_URL || '';

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const InventoryTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredItems = inventoryItems.filter(item =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Package className="mr-2" /> Inventory Management
        </h1>

        <Card className="mb-4">
          <CardContent>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Expiry Date</th>
                    <th className="text-left py-3 px-4">Available</th>
                    <th className="text-left py-3 px-4">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.product}</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">${item.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'shopper' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.location && item.location.latitude && item.location.longitude ? (
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <MapPin className="h-4 w-4" />
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No location</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No inventory items found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedItem.product}</h3>
                  <p className="text-gray-600">Location Details</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Latitude:</strong> {selectedItem.location.latitude}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Longitude:</strong> {selectedItem.location.longitude}
                </p>
              </div>
              <MapComponent
                latitude={selectedItem.location.latitude}
                longitude={selectedItem.location.longitude}
                zoom={15}
                height="400px"
                editable={false}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const NotificationsTab = () => {
    const [notificationsList, setNotificationsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/admin/notifications`, {
          headers: {
            'user-id': currentUser._id
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotificationsList(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchNotifications();
    }, []);

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Bell className="mr-2" /> Notifications
        </h1>
        <Card className="">
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading notifications...</div>
            ) : notificationsList.length > 0 ? (
              <div className="space-y-4">
                {notificationsList.map((notif) => (
                  <div key={notif._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {notif.itemId?.product || 'Item'} - Price Alert
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          User: {notif.userId?.name || 'N/A'} ({notif.email})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        notif.notified ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {notif.notified ? 'Sent' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No notifications available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/admin/orders`, {
          headers: {
            'user-id': currentUser._id
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchOrders();
    }, []);

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" /> Orders
        </h1>
        <Card className="">
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-lg">{order.userId?.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-600">{order.userId?.email || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span> <span className="font-medium">{order.items?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span> <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment:</span> <span className="font-medium">{order.paymentMethod.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {order.shippingAddress && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Address:</span> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardView currentUser={currentUser} />;
      case 'users':
        return <AdminUserManagementView currentUser={currentUser} />;
      case 'inventory':
        return <InventoryTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'orders':
        return <OrdersTab />;
      case 'reports':
        return <AdminReportsView currentUser={currentUser} />;
      default:
        return <AdminDashboardView currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pb-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminView;
