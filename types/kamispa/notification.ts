export type NotificationType =
  | "appointment_reminder"
  | "appointment_confirmation"
  | "appointment_cancellation"
  | "system"

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  appointmentId?: string
  createdAt: string
}
