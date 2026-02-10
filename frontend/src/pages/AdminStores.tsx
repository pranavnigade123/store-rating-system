import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

// store data structure
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  owner_name: string;
  average_rating: string;
  total_ratings: number;
  created_at: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Owner {
  id: string;
  name: string;
  email: string;
}

const AdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // create store modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerUserId: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  
  // owner list for dropdown
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  // fetch stores whenever filters change
  useEffect(() => {
    fetchStores();
  }, [pagination.page, searchQuery, sortBy, sortOrder]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      // build query params
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      };
      
      if (searchQuery) params.search = searchQuery;

      const response = await apiClient.get('/admin/stores', { params });
      setStores(response.data.stores);
      setPagination(response.data.pagination);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    setLoadingOwners(true);
    try {
      // get all users with OWNER role
      const response = await apiClient.get('/admin/users', {
        params: { role: 'OWNER', limit: 100 }
      });
      setOwners(response.data.users);
    } catch (err) {
      console.error('Failed to load owners:', err);
    } finally {
      setLoadingOwners(false);
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

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitting(true);

    try {
      await apiClient.post('/admin/stores', formData);
      // close modal and reset form
      setShowModal(false);
      setFormData({ name: '', email: '', address: '', ownerUserId: '' });
      fetchStores(); // reload the list
    } catch (err: any) {
      // show validation errors
      if (err.response?.data?.error?.details) {
        setFormErrors(err.response.data.error.details);
      } else {
        setFormErrors({ general: err.response?.data?.error?.message || 'Failed to create store' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // table columns config
  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'owner_name', label: 'Owner', sortable: false },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'average_rating', label: 'Rating', sortable: false },
    { key: 'total_ratings', label: 'Reviews', sortable: false },
    { key: 'created_at', label: 'Created', sortable: true }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // format data for table display
  const tableData = stores.map(store => ({
    ...store,
    average_rating: `${store.average_rating} ⭐`,
    created_at: formatDate(store.created_at)
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Stores</h1>
          <Button onClick={() => {
            setShowModal(true);
            fetchOwners(); // load owners when opening modal
          }}>
            Create Store
          </Button>
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
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
              placeholder="Search by store name or address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

        {/* Create Store Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Store</h2>
              
              <form onSubmit={handleCreateStore}>
                <Input
                  label="Store Name"
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
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={formErrors.address}
                  required
                  placeholder="Max 400 characters"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner <span className="text-red-500">*</span>
                  </label>
                  {loadingOwners ? (
                    <div className="py-2">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <select
                      value={formData.ownerUserId}
                      onChange={(e) => setFormData({ ...formData, ownerUserId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select an owner</option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.ownerUserId && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.ownerUserId}</p>
                  )}
                </div>

                {formErrors.general && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {formErrors.general}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" loading={submitting} className="flex-1">
                    Create Store
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: '', email: '', address: '', ownerUserId: '' });
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

export default AdminStores;
