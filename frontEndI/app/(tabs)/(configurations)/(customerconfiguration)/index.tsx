import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { CustomerConfiguration } from '../../../../../commons/models/customerConfiguration';
import { useCustomers, fetchCustomers } from '../../../../hooks/useCustomer';
import { Appbar, FAB, Button, Modal } from 'react-native-paper';
import { router, useNavigation } from 'expo-router';

const CustomerListScreen = () => {
  const [customers, setCustomers] = useState<CustomerConfiguration[]>([]);
  const [filtered, setFiltered] = useState<CustomerConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerConfiguration | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleAdd = () => {
    setModalVisible(false)
    router.push('/AddEditCustomer')
    
  };

  const handleSelectCustomer = (customer: CustomerConfiguration) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    console.log('fetching')
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
      setFiltered(data);
      setLoading(false);
    };

  useEffect(() => {
    if (searchQuery === '') {
      setFiltered(customers);
    } else {
      const filteredList = customers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(filteredList);
    }
  }, [searchQuery, customers]);

  const renderItem = ({ item }: { item: CustomerConfiguration }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSelectCustomer(item)}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.contact}>{item.contactNo}</Text>
      <Text style={styles.address}>{item.address}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => 
        router.back()
        }
          />
        <Appbar.Content title="Customers" />
      </Appbar.Header>

      <TextInput
        placeholder="Search by first name"
        style={styles.search}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No customers found</Text>}
      />

      <FAB style={styles.fab} icon="plus" onPress={handleAdd} label="Add Customer" />

      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedCustomer && (
            <>
              <Text style={styles.modalTitle}>{selectedCustomer.firstName} {selectedCustomer.lastName}</Text>
              <Text style={styles.modalText}>Phone: {selectedCustomer.contactNo}</Text>
              <Text style={styles.modalText}>Address: {selectedCustomer.address}</Text>
              <Text style={styles.modalText}>City: {selectedCustomer.city}</Text>
              <Text style={styles.modalText}>Email: {selectedCustomer.emailId}</Text>

              <Button
                icon="phone"
                mode="contained"
                onPress={() => handleCall(selectedCustomer.contactNo)}
                style={{ marginTop: 16 }}
              >
                Call
              </Button>

              <Button
                icon="pencil"
                mode="contained"
                onPress={() => {
                  setModalVisible(false)
                  router.push({
                    pathname: '/AddEditCustomer',
                    params: {
                      customer: JSON.stringify(selectedCustomer),
                    },
                })
              }
                }
                style={{ marginTop: 16 }}
              >
                Edit
              </Button>

              <Button
                icon="delete"
                mode="contained"
                // onPress={()}
                style={{ marginTop: 16 }}
              >
                Delete
              </Button>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default CustomerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contact: {
    color: 'gray',
    marginTop: 4,
  },
  address: {
    marginTop: 4,
    fontSize: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
