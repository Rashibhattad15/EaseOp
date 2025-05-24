import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { fetchUnits, deleteUnit, updateUnit, addUnit } from '../../../../hooks/useUnits';
import { Unit } from '../../../../../commons/models/productConfiguration/UnitConfig';
import { IconButton, Provider as PaperProvider, FAB } from 'react-native-paper';
import AddUnitDialog from './AddUnitDialog'; // 👈 Import your dialog

const UnitListScreen = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null); // null = create mode

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await fetchUnits();
    setUnits(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Unit', 'Are you sure you want to delete this unit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUnit(id);
          loadItems();
        },
      },
    ]);
  };

  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setDialogVisible(true);
  };

  const handleAdd = () => {
    setSelectedUnit(null);
    setDialogVisible(true);
  };

  const handleSave = async (unitName: string) => {
    if (selectedUnit) {
      await updateUnit(selectedUnit.id, { unitName });
    } else {
      await addUnit({ unitName });
    }

    setDialogVisible(false);
    setSelectedUnit(null);
    loadItems();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <FlatList
        data={units}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.unitItem}>
            <Text style={styles.unitText}>{item.unitName}</Text>
            <View style={styles.actions}>
              <IconButton icon="pencil" onPress={() => handleEdit(item)} />
              <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.center}>No units found.</Text>}
      />

      {/* ✅ Add/Edit Dialog */}
      <AddUnitDialog
        visible={dialogVisible}
        onDismiss={() => {
          setDialogVisible(false);
          setSelectedUnit(null);
        }}
        initialUnitName={selectedUnit?.unitName}
        onSave={handleSave}
        title={selectedUnit ? 'Edit Unit' : 'Add Unit'}
      />

      {/* ➕ Floating Add Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAdd}
        label="Add Unit"
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  unitItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitText: { fontSize: 18 },
  actions: { flexDirection: 'row', gap: 4 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default UnitListScreen;
