import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/UIComponents';
import { Users, Edit, Trash2, UserCheck, Search, UserX, UserPlus } from 'lucide-react';

const AdminUserManagementView = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', userType: '' });
  // @ts-ignore - Vite env variable
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/admin/users`, {
        headers: {
          'user-id': currentUser._id
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      userType: user.userType
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': currentUser._id
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchUsers();
        setEditingUser(null);
        setFormData({ name: '', email: '', userType: '' });
        alert('User updated successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleToggleStatus = async (userId, userName, isActive) => {
    const action = isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} user "${userName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'user-id': currentUser._id
        }
      });

      if (response.ok) {
        await fetchUsers();
        alert(`User ${action}d successfully`);
      } else {
        const error = await response.json();
        alert(error.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'user-id': currentUser._id
        }
      });

      if (response.ok) {
        await fetchUsers();
        alert('User deleted successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (filterType === 'all') return true;
      return user.userType === filterType;
    })
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'shopper': return 'bg-green-100 text-green-800';
      case 'retailer': return 'bg-blue-100 text-blue-800';
      case 'charity': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
          <Users className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
          <span className="hidden sm:inline">User Management</span>
          <span className="sm:hidden">Users</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Manage all platform users</p>
      </div>

      <Card className="mb-4 sm:mb-6">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Users</option>
              <option value="shopper">Shoppers</option>
              <option value="retailer">Retailers</option>
              <option value="charity">Charities</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <Card className="mb-4 sm:mb-6 border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Edit User: {editingUser.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Update user information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">User Type</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                >
                  <option value="shopper">Shopper</option>
                  <option value="retailer">Retailer</option>
                  <option value="charity">Charity</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Total: {users.length} | Showing: {filteredUsers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Name</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">Email</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Type</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">Joined</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className={`border-b hover:bg-gray-50 ${!user.isActive ? 'opacity-60' : ''}`}>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
                      <div>
                        {user.name}
                        <span className="md:hidden block text-xs text-gray-500 font-normal">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{user.email}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {user.userType !== 'admin' ? (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit user"
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user._id, user.name, user.isActive)}
                            className={`p-1.5 sm:p-2 ${user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} rounded`}
                            title={user.isActive ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.isActive ? <UserX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs sm:text-sm flex items-center">
                          <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Protected</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No users found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagementView;
