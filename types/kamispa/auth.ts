export interface User {
  uid: string
  email: string
  displayName: string
  role: "admin" | "customer"
  phone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface ProfileUpdateData {
  displayName?: string
  phone?: string
  address?: string
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
}
