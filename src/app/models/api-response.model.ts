export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
