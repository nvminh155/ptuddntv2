import { Appointment } from '@/types/kamispa';
import firestore from '@react-native-firebase/firestore';

// Fetch all appointments
export async function fetchAppointments() {
  try {
    const appointmentsSnapshot = await firestore().collection('appointments').get();
    return appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch appointments');
  }
}

// Fetch appointments by customerId
export async function fetchCustomerAppointments(customerId: string) {
  try {
    const querySnapshot = await firestore()
      .collection('appointments')
      .where('customerId', '==', customerId)
      .get();

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch customer appointments');
  }
}

// Create a new appointment
export async function createAppointment(appointmentData: Omit<Appointment, 'id'>) {
  try {
    const docRef = await firestore().collection('appointments').add({
      ...appointmentData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create appointment');
  }
}

// Update an existing appointment
export async function updateAppointment(
  appointmentId: string,
  appointmentData: Partial<Omit<Appointment, 'id'>>
) {
  try {
    await firestore().collection('appointments').doc(appointmentId).update({
      ...appointmentData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update appointment');
  }
}

// Delete an appointment
export async function deleteAppointment(appointmentId: string) {
  try {
    await firestore().collection('appointments').doc(appointmentId).delete();
    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete appointment');
  }
}
