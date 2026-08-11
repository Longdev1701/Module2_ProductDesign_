import type { ApiError, ApiResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface CacheItem {
  data: any;
  expiresAt: number;
}

class ApiClient {
  private inFlightRequests = new Map<string, Promise<any>>();
  private responseCache = new Map<string, CacheItem>();
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private getActiveOrgId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('active_org_id');
  }

  private clearCache() {
    this.responseCache.clear();
  }

  private async tryRefreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body?.data?.accessToken) {
          localStorage.setItem('access_token', body.data.accessToken);
          if (body.data.refreshToken) {
            localStorage.setItem('refresh_token', body.data.refreshToken);
          }
          return body.data.accessToken as string;
        }
        return null;
      } catch {
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options: RequestInit = {}, isRetry: boolean = false): Promise<ApiResponse<T>> {
    const isGet = !options.method || options.method.toUpperCase() === 'GET';
    const token = this.getAuthToken();
    const activeOrgId = this.getActiveOrgId();
    const cacheKey = `${options.method || 'GET'}:${endpoint}:${activeOrgId || ''}:${token || ''}`;

    // 1. Check Short-Lived Memory Cache for GET (TTL 5s)
    if (isGet && !isRetry) {
      const cached = this.responseCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data as ApiResponse<T>;
      }

      // 2. Request Deduplication: Reuse pending promise if same GET request is in flight
      if (this.inFlightRequests.has(cacheKey)) {
        return this.inFlightRequests.get(cacheKey)! as Promise<ApiResponse<T>>;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (activeOrgId) {
      headers['x-organization-id'] = activeOrgId;
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errorData: ApiError = body.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Có lỗi xảy ra, vui lòng thử lại',
          };

          // 401 Unauthorized handling with Auto Refresh Token
          if (response.status === 401 && !isRetry && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/auth/refresh')) {
            const newToken = await this.tryRefreshToken();
            if (newToken) {
              // Retry request with new token
              const retryHeaders = {
                ...headers,
                'Authorization': `Bearer ${newToken}`,
              };
              return this.request<T>(endpoint, { ...options, headers: retryHeaders }, true);
            }

            // Refresh failed ➔ Clean state and redirect to /login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
              }
            }
          }

          throw errorData;
        }

        // Cache successful GET response for 5 seconds
        if (isGet) {
          this.responseCache.set(cacheKey, {
            data: body,
            expiresAt: Date.now() + 5000,
          });
        }

        return body as ApiResponse<T>;
      } finally {
        if (isGet) {
          this.inFlightRequests.delete(cacheKey);
        }
      }
    })();

    if (isGet && !isRetry) {
      this.inFlightRequests.set(cacheKey, fetchPromise);
    }

    return fetchPromise;
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    this.clearCache(); // Invalidate GET cache on mutation
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: unknown, options?: RequestInit) {
    this.clearCache(); // Invalidate GET cache on mutation
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    this.clearCache(); // Invalidate GET cache on mutation
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
