import { Customer } from '@/types/kamispa';
import firestore from '@react-native-firebase/firestore';


// Fetch all customers with appointment stats
export async function fetchCustomers() {
  try {
    const customersSnapshot = await firestore()
      .collection('users')
      .where('role', '==', 'customer')
      .get();

    const customers = await Promise.all(
      customersSnapshot.docs.map(async (doc) => {
        const appointmentsSnapshot = await firestore()
          .collection('appointments')
          .where('customerId', '==', doc.id)
          .get();

        const appointments = appointmentsSnapshot.docs.map((doc) => doc.data());

        let lastAppointment = '';
        if (appointments.length > 0) {
          const sortedAppointments = [...appointments].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          lastAppointment = `${sortedAppointments[0].date}`;
        }

        const data = doc.data();

        return {
          id: doc.id,
          name: data.displayName,
          email: data.email,
          phone: data.phone,
          appointmentsCount: appointments.length,
          lastAppointment,
        };
      })
    );

    return customers;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch customers');
  }
}

// Fetch a single customer by ID
export async function fetchCustomerById(customerId: string) {
  try {
    const customerDoc = await firestore().collection('users').doc(customerId).get();

    if (!customerDoc.exists) {
      throw new Error('Customer not found');
    }

    const data = customerDoc.data();

    return {
      id: customerDoc.id,
      displayName: data?.displayName,
      email: data?.email,
      phone: data?.phone,
      address: data?.address,
      notes: data?.notes,
    } as Customer;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch customer');
  }
}

// Update customer info
export async function updateCustomer(customerId: string, customerData: Partial<Customer>) {
  try {
    const updatePayload: any = {
      updatedAt: new Date().toISOString(),
    };

    if (customerData.displayName) updatePayload.displayName = customerData.displayName;
    if (customerData.phone) updatePayload.phone = customerData.phone;
    if (customerData.address) updatePayload.address = customerData.address;
    if (customerData.notes) updatePayload.notes = customerData.notes;

    await firestore().collection('users').doc(customerId).update(updatePayload);

    return true;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update customer');
  }
}

// Mock dashboard (can be replaced with live logic later)
export async function fetchCustomerDashboard() {
  return {
    upcomingAppointments: [
      {
        id: '1',
        serviceName: 'Haircut',
        date: '2023-06-15',
        time: '10:00 AM',
        status: 'confirmed',
      },
      {
        id: '2',
        serviceName: 'Manicure',
        date: '2023-06-20',
        time: '2:30 PM',
        status: 'pending',
      },
    ],
    recentServices: [
      {
        id: '1',
        name: 'Haircut',
        description: 'Professional haircut with styling',
        price: 35,
      },
      {
        id: '2',
        name: 'Manicure',
        description: 'Classic manicure with polish',
        price: 25,
      },
      {
        id: '3',
        name: 'Facial',
        description: 'Rejuvenating facial treatment',
        price: 50,
      },
    ],
  };
}
