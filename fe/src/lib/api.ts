const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    requestId?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getActiveOrgId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('active_org_id');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const activeOrgId = this.getActiveOrgId();

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

      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      throw errorData;
    }

    return body as ApiResponse<T>;
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
