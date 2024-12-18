export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    name?: string;
    last_name?: string;
  };
  detail?: string;
  message?: string;
}

export interface ErrorResponse {
  detail?: string;
  [key: string]: any;
}
