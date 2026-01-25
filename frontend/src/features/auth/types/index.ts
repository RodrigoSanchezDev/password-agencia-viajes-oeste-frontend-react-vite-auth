// Auth types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id?: string;
  message?: string;
  user?: GitHubUser;
}

export interface GitHubAuthResponse {
  token: string;
  message: string;
  user: GitHubUser;
}

export interface GitHubUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  githubUsername?: string;
  provider: 'github' | 'local';
}

export interface GitHubAuthUrlResponse {
  authUrl: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  githubUsername?: string;
  provider?: 'github' | 'local';
  createdAt?: string;
}
