import axios from 'axios';
import { setupCache, buildMemoryStorage } from 'axios-cache-interceptor';
import { useAppStore } from '../store';


// ✅ Step 1: Create shared memory storage
const memoryStorage = buildMemoryStorage();

// ✅ Step 2: Setup API instance with cache
export const api = setupCache(axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
}), {
  storage: memoryStorage, // 👈 critical fix: assign custom storage
});

// ✅ Step 3: Invalidate cache globally
export const clearAllCache = async () => {
  console.log("Cache attached?", typeof memoryStorage.clear === 'function'); // should log 'true'
  if (typeof memoryStorage.clear === 'function') {
    await memoryStorage.clear(); // 🚨 wipes everything
    console.log("🔁 Cache cleared globally.");
  } else {
    console.log("❌ Cache not available.");
  }
};

export const getDocument = async (id) => {
  try {
    const response = await api.get(`/documents/${id}`, {
      cache: { ttl: Infinity },
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};

// ✅ Shared error handler
const handleError = (error) => {
  if (error.response) {
    return {
      source: 'server',
      status: error.response.status,
      message: error.response.data?.message || 'Server Error',
      raw: error,
    };
  } else if (error.request) {
    return {
      source: 'network',
      status: null,
      message: 'No response from server. Check your connection.',
      raw: error,
    };
  } else {
    return {
      source: 'client',
      status: null,
      message: error.message || 'Unexpected client error',
      raw: error,
    };
  }
};

// ✅ GET (infinite cache unless cleared manually)
export const apiGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, {
      ...config,
      cache: { ttl: Infinity }, // cache forever unless cleared
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};

// ✅ POST
export const apiPost = async (url, body = {}, config = {}) => {
  try {
    let finalConfig = { ...config };

    // ⏱️ Use provided timeout if available, else default (4000ms)
    if (config.timeout !== undefined) {
      finalConfig.timeout = config.timeout;
    } else {
      finalConfig.timeout = 4000;
    }

    // 🔎 If body is FormData, force multipart
    if (body instanceof FormData) {
      finalConfig.headers = {
        ...finalConfig.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api.post(url, body, finalConfig);
    await clearAllCache(); // 🧹 clear cache after mutation
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};



// ✅ PUT
export const apiPut = async (url, body = {}, config = {}) => {
  try {
    let finalConfig = { ...config };

    // If sending FormData, set multipart headers
    if (body instanceof FormData) {
      finalConfig.headers = {
        ...finalConfig.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api.put(url, body, finalConfig);
    await clearAllCache();
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};

// ✅ PATCH
export const apiPatch = async (url, body = {}, config = {}) => {
  try {
    let finalConfig = { ...config };

    // If sending FormData, set multipart headers
    if (body instanceof FormData) {
      finalConfig.headers = {
        ...finalConfig.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await api.patch(url, body, finalConfig);
    await clearAllCache(); // clear cache after mutation
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};


// ✅ DELETE
export const apiDelete = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    await clearAllCache(); // 🧹 clear cache after mutation
    return { data: response.data, error: null };
  } catch (error) {
    return { error: handleError(error) };
  }
};

// ✅ Utility: Load and manage items
export const fetchItems = async (url, setItems, setReqState, agency) => {

  setReqState("loading");

  try {
    const res = await apiGet(url, { params: { ...agency } });

    if (!res.error) {
      const items = res.data || [];
      if (items.length > 0) {
        setItems(items);
        setReqState("success");
      } else {
        setReqState("empty");
      }
    } else {
      setReqState(res.error.source);
    }
  } catch (err) {
    console.error("Error fetching items:", err);
    setReqState("error");
  }
};

export const fetchPlacesData = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`
    );
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("❌ Failed to fetch places:", err.message);
    return [];
  }
};