import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCustomers } from '../../../../hooks/useCustomer'; // adjust path if needed
import { CustomerConfiguration } from '@commons/models/customerConfiguration';
import { SaudaPayload } from '@commons/models/productConfiguration/SaudaPayload';

export default function SelectCustomerScreen() {
  const router = useRouter();
  const { manageState } = useLocalSearchParams();
  const currentSauda: SaudaPayload = manageState ? JSON.parse(manageState as string) : {} as SaudaPayload;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerConfiguration[]>([]);
  const [customers, setCustomers] = useState<CustomerConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
      setLoading(false);
    };
    loadCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((cust) =>
      cust.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchQuery, customers]);

  const handleSelect = (selectedCustomer: CustomerConfiguration) => {
    const updatedSauda: SaudaPayload = {
      ...currentSauda,
      customer: selectedCustomer,
    };

    router.replace({
      pathname: '/(tabs)/(home)/(saudaEntry)/SaudaCreationScreen',
      params: {
        manageState: JSON.stringify(updatedSauda),
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Select Customer" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search customers"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={styles.center}>
            <Text>No customers found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <View>
                  <Text style={styles.text}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.subText}>{item.city} | {item.contactNo}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
});
