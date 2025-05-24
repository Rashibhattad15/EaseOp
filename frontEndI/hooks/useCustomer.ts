import { useEffect, useState } from 'react';
import { CustomerConfiguration } from '../../commons/models/customerConfiguration';
import {
  ref,
  get,
  child,
  set,
  update,
  remove,
  push,
} from 'firebase/database';
import { realtimedb } from '../firebaseConfig';
import { Category } from '../../commons/models/productConfiguration/CategoriesConfig';

export const fetchCustomers = async (): Promise<CustomerConfiguration[]> => {
    const dbRef = ref(realtimedb);
    try {
      const snapshot = await get(child(dbRef, 'customerConfigurations'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data).map(([id, customer]: any) => ({ id, ...customer }));
      } else {
        console.log('No cusomters available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching cusomters:', error);
      return [];
    }};

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerConfiguration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

   

  const addCustomer = async (customer: CustomerConfiguration) => {
    const newRef = push(ref(realtimedb, 'customerConfigurations'));
    await set(newRef, {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address || '',
      city: customer.city,
      contactNo: customer.contactNo,
      emailId: customer.emailId,
    });
    return fetchCustomers(); // return updated list after addition
  };

  const updateCustomer = async (id: string, customer: CustomerConfiguration) => {
    const customerRef = ref(realtimedb, `customerConfigurations/${id}`);
    await update(customerRef, {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address || '',
      city: customer.city,
      contactNo: customer.contactNo,
      emailId: customer.emailId,
    });
    return fetchCustomers(); // return updated list after update
  };

  const deleteCustomer = async (id: string) => {
    const customerRef = ref(realtimedb, `customerConfigurations/${id}`);
    await remove(customerRef);
    return fetchCustomers(); // return updated list after delete
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
