import { auth } from "@/auth";
import { getSession } from "next-auth/react";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}


let sessionPromise = null;
let cachedSession = null;
let lastSessionFetchTime = 0;
const SESSION_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

async function getClientSessionCached() {
    const now = Date.now();
    if (cachedSession && (now - lastSessionFetchTime < SESSION_CACHE_DURATION)) {
        return cachedSession;
    }
    if (!sessionPromise) {
        sessionPromise = getSession().then(session => {
            cachedSession = session;
            lastSessionFetchTime = Date.now();
            sessionPromise = null; // Clear promise so next fetch gets a fresh one if cache expires
            return session;
        }).catch(err => {
            sessionPromise = null;
            throw err;
        });
    }
    return sessionPromise;
}

async function apiCall(endpoint, options = {}) {
  let url = endpoint.startsWith("http") 
    ? endpoint 
    : `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const { headers = {}, body, params, ...customOptions } = options;

  if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }
  
  let session = null;
  if (typeof window !== "undefined") {
    session = await getClientSessionCached();
  } else {
    try {
      session = await auth();
    } catch (e) {
      console.warn("Could not retrieve session in server-side apiCall scope:", e);
    }
  }

  let token = "";
  if (session) token = session.accessToken;
  
  const reqHeaders = {
    ...headers,
    "Authorization": `Bearer ${token}`
  };

  let reqBody = body;

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    reqHeaders["Content-Type"] = "application/json";
    reqBody = JSON.stringify(body);
  }

  const config = {
    method: options.method || "GET",
    headers: reqHeaders,
    body: reqBody,
    credentials: options.credentials || "include",
    ...customOptions,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      const errorMessage = data?.message || data?.error || `HTTP error! Status: ${response.status}`;
      if (response.status === 429 && typeof window !== "undefined") {
        import("sonner").then(({ toast }) => {
          toast.error(errorMessage);
        }).catch((err) => console.error("Toast error:", err));
      }
      throw new APIError(errorMessage, response.status, data);
    }

    if (options.responseType === "blob") {
      return await response.blob();
    }

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message || "Network Error occurred", 0, null);
  }
}

export const api = {
  get: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => apiCall(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => apiCall(endpoint, { ...options, method: "DELETE" }),
};

export default api;
