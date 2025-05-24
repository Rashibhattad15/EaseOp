import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  FAB,
  Provider as PaperProvider,
  Portal,
  Dialog,
  Button,
  Modal,
} from 'react-native-paper';
import { useItems } from '../../../../hooks/useItems';
import { router } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function ItemsListScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const { fetchItems } = useItems();

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchItems();
      setItems(data);
      setLoading(false);
    };
    loadItems();
  }, []);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setDialogVisible(true);
  };

  const handleEdit = () => {
    setDialogVisible(false);
    router.push({
      pathname: '/AddItemDialog',
      params: { item: JSON.stringify(selectedItem) },
    });
  };

  const handleDelete = () => {
    // Add your delete logic here
    console.log('Delete', selectedItem?.id);
    setDialogVisible(false);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <View style={styles.row}>
        <View style={styles.leftContent}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text style={styles.detail}>Size: {item.size}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text
            style={[
              styles.rateDifference,
              { color: item.rateDifference >= 0 ? 'green' : 'red' },
            ]}
          >
            {item.rateDifference >= 0 ? '+' : ''}
            {item.rateDifference}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading items...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          label="Add Item"
          style={styles.fab}
          onPress={() => router.push('/AddItemDialog')}
        />

        {/* Item Detail Dialog */}
        <Portal>
  <Modal
    visible={dialogVisible}
    onDismiss={() => setDialogVisible(false)}
    contentContainerStyle={styles.bottomSheet}
  >
    <View style={styles.sheetHeader} />
    <Text style={styles.sheetTitle}>Item Details</Text>
    {selectedItem && (
      <>
        <Text>Name: {selectedItem.itemName}</Text>
        <Text>Category: {selectedItem.category?.category}</Text>
        <Text>Size: {selectedItem.size}</Text>
        <Text>Unit: {selectedItem.unit?.unit}</Text>
        <Text>Opening Qty: {selectedItem.openingQuantity}</Text>
        <Text
          style={{ color: selectedItem.rateDifference >= 0 ? 'green' : 'red' }}
        >
          Rate Diff: {selectedItem.rateDifference}
        </Text>
      </>
    )}
    <View style={styles.sheetActions}>
      <Button mode="contained" onPress={handleEdit} style={{ marginRight: 8 }}>
        Edit
      </Button>
      <Button mode="contained-tonal" onPress={handleDelete} textColor="red">
        Delete
      </Button>
    </View>
  </Modal>
</Portal>

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    width: screenWidth - 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rateDifference: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  dialog: {
    borderRadius: 12,
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  
  sheetHeader: {
    height: 5,
    width: 40,
    backgroundColor: '#ccc',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 12,
  },
  
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // adds space between the buttons
    marginTop: 20,
  },
  
});
