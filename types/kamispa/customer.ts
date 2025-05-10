export interface Customer {
  id: string
  displayName: string
  email: string
  phone: string
  address?: string
  notes?: string
  appointmentsCount?: number
  lastAppointment?: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerUpdateData {
  displayName?: string
  phone?: string
  address?: string
  notes?: string
}
