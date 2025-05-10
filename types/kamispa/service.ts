export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration?: number
  category?: string
  image?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ServiceCreateData {
  name: string
  description: string
  price: number
  duration?: number
  category?: string
  image?: string
  isActive?: boolean
}

export interface ServiceUpdateData {
  name?: string
  description?: string
  price?: number
  duration?: number
  category?: string
  image?: string
  isActive?: boolean
}
