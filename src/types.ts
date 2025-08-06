export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  joinedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}