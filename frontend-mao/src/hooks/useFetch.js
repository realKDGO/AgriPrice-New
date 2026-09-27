import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * useFetch — Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error } = useFetch('/prices');
 *
 * @param {string} url - Relative URL path (appended to base URL in api.js)
 * @param {object} [options] - Additional axios config options
 */
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Allow effect cleanup to cancel stale requests
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(url, options);
        if (!isCancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
