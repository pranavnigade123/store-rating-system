import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';

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
    
    for (const store of storesList) {
      try {
        const response = await apiClient.get(`/stores/${store.id}/rating`);
        if (response.data.rating) {
          ratings[store.id] = response.data.rating.rating;
        }
      } catch (err) {
        // no rating yet
      }
    }
    
    setUserRatings(ratings);
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    setSubmittingRating(storeId);
    const previousRating = userRatings[storeId];
    
    setUserRatings({ ...userRatings, [storeId]: rating });
    
    try {
      await apiClient.post(`/stores/${storeId}/rating`, { rating: Number(rating) });
      
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Stores</h1>
          <p className="text-slate-600">Discover and rate local stores</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores..."
            className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchQuery && (
            <p className="text-sm text-slate-500 mt-3">
              {loading ? 'Searching...' : `${stores.length} store${stores.length !== 1 ? 's' : ''} found`}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {stores.length === 0 ? (
          <EmptyState 
            message="No stores found" 
            description="Try adjusting your search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex-1">{store.name}</h3>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                    <span className="text-lg font-bold text-orange-600">{store.average_rating}</span>
                    <span className="text-orange-500">★</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {store.owner_name}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {store.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {store.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    {store.total_ratings} {store.total_ratings === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* User Rating */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    {userRatings[store.id] ? 'Your rating' : 'Rate this store'}
                  </p>
                  <div className="flex gap-1">
                    {renderStars(store.id, userRatings[store.id] || 0)}
                  </div>
                  {submittingRating === store.id && (
                    <p className="text-sm text-orange-600 mt-2">Saving...</p>
                  )}
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
