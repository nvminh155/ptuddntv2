import { Appointment } from '@/types/kamispa';
import firestore from '@react-native-firebase/firestore';

export async function fetchDashboardStats() {
  try {
    // Get total services count
    const servicesSnapshot = await firestore().collection("services").get();
    const totalServices = servicesSnapshot.docs.length;

    // Get customers count
    const customersSnapshot = await firestore()
      .collection("users")
      .where("role", "==", "customer")
      .get();
    const totalCustomers = customersSnapshot.docs.length;

    // Get all appointments
    const appointmentsSnapshot = await firestore().collection("appointments").get();
    const appointments = appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Appointment));

    // Count pending and completed appointments
    const pendingAppointments = appointments.filter((app) => app.status === "pending").length;
    const completedAppointments = appointments.filter((app) => app.status === "completed").length;

    // Get recent appointments (sorted by date descending)
    const recentAppointments = appointments
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((app) => ({
        id: app.id,
        customerName: app.customerName,
        serviceName: app.serviceName,
        date: app.date,
        status: app.status,
      }));

    return {
      totalServices,
      totalCustomers,
      pendingAppointments,
      completedAppointments,
      recentAppointments,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }
}
