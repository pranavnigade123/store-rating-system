import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  created_at: string;
}

interface Rating {
  id: string;
  rating: number;
  created_at: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

interface DashboardData {
  store: Store;
  averageRating: string;
  totalRatings: number;
  ratings: Rating[];
}

const OwnerDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/owner/dashboard');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <EmptyState 
            message="No store found" 
            description="Contact admin to create a store for your account"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

        {/* Store Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{data.store.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{data.store.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p>{data.store.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p>{formatDate(data.store.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Rating Summary</h2>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{data.averageRating}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{data.totalRatings}</div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          
          {data.ratings.length === 0 ? (
            <EmptyState 
              message="No ratings yet" 
              description="Your store hasn't received any ratings"
            />
          ) : (
            <div className="space-y-4">
              {data.ratings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{rating.user_name}</p>
                      <p className="text-sm text-gray-500">{rating.user_email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex">{renderStars(rating.rating)}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(rating.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
