const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || "http://127.0.0.1:8000";

export const API_BASE_URL = `${API_ORIGIN}/api`;

function normalizePath(path) {
  const [pathname, query = ""] = path.split("?");
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return query ? `${withSlash}?${query}` : withSlash;
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${normalizePath(path)}`, options);

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. some error responses)
  }

  if (!res.ok) {
    const message = (data && data.message) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data?.results ?? data;
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
