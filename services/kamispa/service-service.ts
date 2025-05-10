import type { Service, ServiceCreateData, ServiceUpdateData } from '@/types/kamispa';
import { checkAdminPermission } from '@/utils/permissions';
import firestore from '@react-native-firebase/firestore';

export async function fetchServices() {
  try {
    const servicesSnapshot = await firestore().collection("services").get();
    return servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch services");
  }
}

export async function fetchServiceById(serviceId: string) {
  try {
    const serviceDoc = await firestore().collection("services").doc(serviceId).get();

    if (!serviceDoc.exists) {
      throw new Error("Service not found");
    }

    return {
      id: serviceDoc.id,
      ...serviceDoc.data(),
    } as Service;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch service");
  }
}

export async function createService(serviceData: ServiceCreateData) {
  try {
    await checkAdminPermission();

    const docRef = await firestore().collection("services").add({
      ...serviceData,
      createdAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create service");
  }
}

export async function updateService(serviceId: string, serviceData: ServiceUpdateData) {
  try {
    await checkAdminPermission();

    await firestore().collection("services").doc(serviceId).update({
      ...serviceData,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update service");
  }
}

export async function deleteService(serviceId: string) {
  try {
    await checkAdminPermission();

    await firestore().collection("services").doc(serviceId).delete();
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete service");
  }
}

export async function searchServices(searchTerm: string) {
  try {
    const services = await fetchServices();

    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to search services");
  }
}
