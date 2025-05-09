export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}