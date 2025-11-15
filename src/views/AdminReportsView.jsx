import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/UIComponents';
import { FileText, Download, Calendar } from 'lucide-react';

const AdminReportsView = ({ currentUser }) => {
  const [reportType, setReportType] = useState('users');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  // @ts-ignore - Vite env variable
  const API_URL = import.meta.env.VITE_API_URL || '';

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(
        `${API_URL}/api/admin/reports/${reportType}?${params.toString()}`,
        {
          headers: {
            'user-id': currentUser._id
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        alert('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!reportData) return;

    let csvContent = '';

    switch (reportType) {
      case 'users':
        csvContent = 'Name,Email,User Type,Created At\n';
        reportData.users.forEach(user => {
          csvContent += `"${user.name}","${user.email}","${user.userType}","${new Date(user.createdAt).toLocaleDateString()}"\n`;
        });
        break;

      case 'inventory':
        csvContent = 'Product,Quantity,Price,Type,Available,Expiry Date,Created At\n';
        reportData.items.forEach(item => {
          csvContent += `"${item.product}","${item.quantity}","${item.price}","${item.type}","${item.available}","${new Date(item.expiryDate).toLocaleDateString()}","${new Date(item.createdAt).toLocaleDateString()}"\n`;
        });
        break;

      case 'notifications':
        csvContent = 'User,Item,Sent,Created At\n';
        reportData.notifications.forEach(notif => {
          csvContent += `"${notif.userId?.name || 'N/A'}","${notif.itemId?.product || 'N/A'}","${notif.notified}","${new Date(notif.createdAt).toLocaleDateString()}"\n`;
        });
        break;

      case 'orders':
        csvContent = 'User,Email,Items Count,Total Amount,Status,Payment Method,Created At\n';
        reportData.orders.forEach(order => {
          csvContent += `"${order.userId?.name || 'N/A'}","${order.userId?.email || 'N/A'}","${order.items?.length || 0}","${order.totalAmount}","${order.status}","${order.paymentMethod}","${new Date(order.createdAt).toLocaleDateString()}"\n`;
        });
        break;
    }

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
          <FileText className="mr-2 h-6 w-6 sm:h-8 sm:w-8" /> Reports
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Generate and download platform reports</p>
      </div>

      <Card className="mb-4 sm:mb-6">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Generate Report</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="users">Users Report</option>
                <option value="inventory">Inventory Report</option>
                <option value="notifications">Notifications Report</option>
                <option value="orders">Orders Report</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 flex items-center">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm sm:text-base"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card className="">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center">
              <div>
                <CardTitle className="text-base sm:text-lg">{reportData.type}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Generated on {new Date(reportData.generatedAt).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadCSV}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-xs sm:text-sm"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> CSV
                </button>
                <button
                  onClick={downloadReport}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-xs sm:text-sm"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> JSON
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Summary</h3>
              <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {reportType === 'users' && (
                  <>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
                      <p className="text-xl sm:text-2xl font-bold">{reportData.totalUsers}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Shoppers</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{reportData.breakdown.shoppers}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Retailers</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{reportData.breakdown.retailers}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Charities</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">{reportData.breakdown.charities}</p>
                    </div>
                  </>
                )}
                {reportType === 'inventory' && (
                  <>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Items</p>
                      <p className="text-xl sm:text-2xl font-bold">{reportData.totalItems}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">${reportData.totalValue}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Available</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{reportData.breakdown.available}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">For Charity</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-600">{reportData.breakdown.charityItems}</p>
                    </div>
                  </>
                )}
                {reportType === 'notifications' && (
                  <>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Notifications</p>
                      <p className="text-xl sm:text-2xl font-bold">{reportData.totalNotifications}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Sent</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{reportData.breakdown.sent}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">{reportData.breakdown.pending}</p>
                    </div>
                  </>
                )}
                {reportType === 'orders' && (
                  <>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                      <p className="text-xl sm:text-2xl font-bold">{reportData.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">${reportData.totalOrderValue}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">{reportData.ordersByStatus?.pending || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{reportData.ordersByStatus?.completed || 0}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {reportData.dateRange && (
              <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                <strong>Date Range:</strong>{' '}
                {reportData.dateRange.startDate || 'All time'} to{' '}
                {reportData.dateRange.endDate || 'Present'}
              </div>
            )}

            <div className="mt-3 sm:mt-4">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Data Preview</h3>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto max-h-64 sm:max-h-96">
                <pre className="text-xs">{JSON.stringify(reportData, null, 2)}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!reportData && !loading && (
        <Card className="">
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm sm:text-base text-gray-600">Select a report type and click Generate Report to view data</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminReportsView;
