const API_URL = 'http://localhost:8001/api';

const fetchJson = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
};

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
    const { field, order } = params.sort || {};
    const filter = params.filter || {};
    const qs = new URLSearchParams();
    qs.set('page', page);
    qs.set('page_size', perPage);
    if (field && order) {
      qs.set('ordering', order === 'ASC' ? field : `-${field}`);
    }
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, v);
    });
    const url = `${API_URL}/${resource}/?${qs.toString()}`;
    const data = await fetchJson(url);
    const total = Array.isArray(data) ? data.length : (data.count || data.results?.length || 0);
    return { data: data.results || data, total };
  },
  getOne: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}/`;
    const data = await fetchJson(url);
    return { data };
  },
  getMany: async (resource, params) => {
    const promises = params.ids.map(id => fetchJson(`${API_URL}/${resource}/${id}/`));
    const data = await Promise.all(promises);
    return { data };
  },
  create: async (resource, params) => {
    const url = `${API_URL}/${resource}/`;
    const data = await fetchJson(url, { method: 'POST', body: JSON.stringify(params.data) });
    return { data };
  },
  update: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}/`;
    const data = await fetchJson(url, { method: 'PUT', body: JSON.stringify(params.data) });
    return { data };
  },
  delete: async (resource, params) => {
    const url = `${API_URL}/${resource}/${params.id}/`;
    await fetchJson(url, { method: 'DELETE' });
    return { data: { id: params.id } };
  },
};

export default dataProvider;
