import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Modal, Portal, Searchbar, Provider } from 'react-native-paper';
import { SaudaPayload } from '../../../../../commons/models/productConfiguration/SaudaPayload';
import { useSaudaEntries } from './../../../../hooks/useSauda';
import { useOffice } from "../../../../context/OfficeContext";
import { router } from 'expo-router';

export default function SaudaScreen() {
  const navigation = useNavigation<any>();
  const {officeId, setOfficeId} = useOffice()
  const { saudaEntries, loading, fetchAllSaudaEntries  } = useSaudaEntries(officeId!);
  const [search, setSearch] = useState('');
  const [selectedSauda, setSelectedSauda] = useState<SaudaPayload | null>(null);

  useEffect(() => {
    fetchAllSaudaEntries();
  }, []);

  const filtered = saudaEntries.filter(sauda =>
    sauda.saudaId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Provider>
    <View style={styles.container}>
      
      <Button mode="contained" onPress={() => router.push('/SaudaCreationScreen')}>
        Create Sauda
      </Button>

      <Searchbar
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
        style={styles.searchBar}
      />


      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filtered.length === 0 ? (
        <Text style={styles.noSauda}>No sauda available.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.saudaId}
          renderItem={({ item }) => (
            <SaudaRowContent sauda={item} onPress={() => setSelectedSauda(item)} />
          )}
        />
      )}

      {/* Modal for Details */}
      <Portal>
  <Modal
    visible={!!selectedSauda}
    onDismiss={() => setSelectedSauda(null)}
    contentContainerStyle={styles.bottomSheet}
  >
    <View style={styles.sheetContent}>
      <Text style={styles.modalTitle}>Sauda Details</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedSauda && (
          <>
            {[
              ['Sauda Id', selectedSauda.saudaId],
              ['Created On', selectedSauda.creationDate],
              ['Quantity', `${selectedSauda.quantity} ${selectedSauda.quantityUnit?.unitName}`],
              ['Rate', selectedSauda.rate.toString()],
              ['Customer Name', `${selectedSauda.customer?.firstName ?? ''} ${selectedSauda.customer?.lastName ?? ''}`],
              ['Customer Contact', selectedSauda.customer?.contactNo ?? 'No customer contact'],
              ['Include GST', selectedSauda.includeGST ? 'Yes' : 'No'],
              ['Include FOR', selectedSauda.includeFOR ? 'Yes' : 'No'],
              ['Include Loading', selectedSauda.includeLoading ? 'Yes' : 'No'],
              ['Sauda State', selectedSauda.saudaStatus],
            ].map(([label, value], index) => (
              <Text
                key={index}
                style={[
                  styles.modalField,
                  index % 2 !== 0 && { backgroundColor: '#f3f3f3' },
                ]}
              >
                {label}: {value}
              </Text>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.modalButtonRow}>
        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('OrderCreation', { sauda: selectedSauda });
            setSelectedSauda(null);
          }}
          style={{ marginRight: 8 }}
        >
          Create Order
        </Button>
        <Button mode="outlined" onPress={() => setSelectedSauda(null)}>
          Send for approval
        </Button>
        <Button mode="outlined" onPress={() => setSelectedSauda(null)}>
          Close
        </Button>
      </View>
    </View>
  </Modal>
</Portal>
    </View>
    </Provider>
  );
}

function SaudaRowContent({ sauda, onPress }: { sauda: SaudaPayload; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardSection}>
            <Text style={styles.saudaId}>{sauda.saudaId}</Text>
            <Text style={styles.customerName}>{sauda.customer?.firstName ?? 'No Customer'}</Text>
          </View>
          <View style={styles.cardSectionRight}>
            <Text style={styles.qtyText}>
              Quantity: {sauda.quantity} {sauda.quantityUnit?.unitName}
            </Text>
            <Text style={styles.rateText}>Rate: {sauda.rate}</Text>
            <Text style={styles.statusText}>Status: {sauda.saudaStatus.toString()}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  noSauda: { textAlign: 'center', marginTop: 20 },
  card: { 
    marginBottom: 8,
    backgroundColor: 'white'
   },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardSection: { flex: 1 },
  cardSectionRight: { flex: 1, alignItems: 'flex-end' },
  saudaId: { fontWeight: 'bold', fontSize: 16 },
  customerName: { color: 'blue', fontSize: 12 },
  qtyText: { fontWeight: 'bold' },
  rateText: { color: 'gray', fontSize: 12 },
  statusText: { color: 'red', fontSize: 14 },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    alignSelf: 'center',
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    position: 'absolute',
    bottom: 0,
  },
  
  sheetContent: {
    flexGrow: 1,
    maxHeight: '100%',
  },
  
  scrollContent: {
    paddingBottom: 16,
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  modalField: {
    fontSize: 16,
    padding: 8,
    borderRadius: 6,
  },
  
  modalButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 16,
  },  
});
