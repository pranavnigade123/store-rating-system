import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

// store with rating info
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  owner_name: string;
  average_rating: string;
  total_ratings: number;
}

const UserStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [submittingRating, setSubmittingRating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // wait a bit before searching to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchStores();
  }, [debouncedSearch]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await apiClient.get('/stores', { params });
      const storesList = response.data.stores;
      setStores(storesList);
      
      await fetchUserRatings(storesList);
      
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async (storesList: Store[]) => {
    const ratings: Record<string, number> = {};
    
    // get user's rating for each store
    for (const store of storesList) {
      try {
        const response = await apiClient.get(`/stores/${store.id}/rating`);
        if (response.data.rating) {
          ratings[store.id] = response.data.rating.rating;
        }
      } catch (err) {
        // no rating yet, skip
      }
    }
    
    setUserRatings(ratings);
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    setSubmittingRating(storeId);
    const previousRating = userRatings[storeId];
    
    // update UI immediately for better feel
    setUserRatings({ ...userRatings, [storeId]: rating });
    
    try {
      await apiClient.post(`/stores/${storeId}/rating`, { rating: Number(rating) });
      
      // recalculate average rating
      setStores(prevStores => 
        prevStores.map(store => {
          if (store.id === storeId) {
            const currentAvg = parseFloat(store.average_rating);
            const currentTotal = store.total_ratings;
            const newTotal = currentTotal + (previousRating ? 0 : 1);
            const newAvg = previousRating 
              ? ((currentAvg * currentTotal - previousRating + rating) / currentTotal).toFixed(2)
              : ((currentAvg * currentTotal + rating) / newTotal).toFixed(2);
            
            return {
              ...store,
              average_rating: newAvg,
              total_ratings: newTotal
            };
          }
          return store;
        })
      );
      
      setToast({ 
        message: previousRating ? 'Rating updated!' : 'Rating submitted!', 
        type: 'success' 
      });
      
    } catch (err: any) {
      console.error('Rating error:', err);
      // undo the change if it failed
      if (previousRating) {
        setUserRatings({ ...userRatings, [storeId]: previousRating });
      } else {
        const { [storeId]: _, ...rest } = userRatings;
        setUserRatings(rest);
      }
      setToast({ 
        message: err.response?.data?.error?.message || 'Failed to submit rating', 
        type: 'error' 
      });
    } finally {
      setSubmittingRating(null);
    }
  };

  const renderStars = (storeId: string, currentRating: number) => {
    const stars = [];
    const isSubmitting = submittingRating === storeId;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleRatingSubmit(storeId, i)}
          disabled={isSubmitting}
          className={`text-2xl transition-all ${
            i <= currentRating ? 'text-yellow-500' : 'text-gray-300'
          } ${!isSubmitting ? 'hover:text-yellow-400 hover:scale-110' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
          title={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          ★
        </button>
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

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Stores</h1>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by name or address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              {loading ? 'Searching...' : `Found ${stores.length} store${stores.length !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {stores.length === 0 ? (
          <EmptyState 
            message="No stores found" 
            description="Try adjusting your search query"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{store.name}</h3>
                <p className="text-gray-600 text-sm mb-1">Owner: {store.owner_name}</p>
                <p className="text-gray-600 text-sm mb-1">{store.email}</p>
                <p className="text-gray-600 text-sm mb-4">{store.address}</p>
                
                {/* Average Rating Display */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{store.average_rating}</span>
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="text-gray-500 text-sm">
                      ({store.total_ratings} {store.total_ratings === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>

                {/* User Rating */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {userRatings[store.id] ? 'Your Rating:' : 'Rate this store:'}
                  </p>
                  <div className="flex gap-1">
                    {renderStars(store.id, userRatings[store.id] || 0)}
                  </div>
                  {submittingRating === store.id ? (
                    <p className="text-sm text-blue-600 mt-2">Saving...</p>
                  ) : userRatings[store.id] ? (
                    <p className="text-sm text-gray-500 mt-2">
                      Click to update
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default UserStores;
