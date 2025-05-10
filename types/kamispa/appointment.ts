export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  price?: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentCreateData {
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  price?: number;
  duration?: number;
}

export interface AppointmentUpdateData {
  date?: string;
  time?: string;
  status?: AppointmentStatus;
  notes?: string;
}
