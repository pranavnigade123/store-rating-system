import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

// user data structure
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string | null;
  created_at: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // filter states
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // create user modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // fetch users whenever filters change
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter, searchQuery, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // build query params
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };
      
      if (roleFilter) params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await apiClient.get('/admin/users', { params });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    // toggle sort order if same field, otherwise default to asc
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      await apiClient.post('/admin/users', formData);
      // close modal and reset form
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchUsers(); // reload the list
    } catch (err: any) {
      // show validation errors
      if (err.response?.data?.error?.details) {
        setFormErrors(err.response.data.error.details);
      } else {
        setFormErrors({ general: err.response?.data?.error?.message || 'Failed to create user' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // table columns config
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'address', label: 'Address', sortable: false },
    { key: 'created_at', label: 'Created', sortable: true }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // format data for table display
  const tableData = users.map(user => ({
    ...user,
    address: user.address || 'N/A',
    created_at: formatDate(user.created_at)
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <Button onClick={() => setShowModal(true)}>
            Create User
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <Table
            columns={columns}
            data={tableData}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New User</h2>
              
              <form onSubmit={handleCreateUser}>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={formErrors.name}
                  required
                  placeholder="20-60 characters"
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={formErrors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={formErrors.password}
                  required
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="USER">User</option>
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                  )}
                </div>

                <Input
                  label="Address (Optional)"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={formErrors.address}
                  placeholder="Max 400 characters"
                />

                {formErrors.general && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {formErrors.general}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" loading={submitting} className="flex-1">
                    Create User
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
                      setFormErrors({});
                    }}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
