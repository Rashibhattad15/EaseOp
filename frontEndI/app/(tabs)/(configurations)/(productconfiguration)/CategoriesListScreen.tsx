import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { IconButton, FAB, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import {
  fetchCategories,
  deleteCategory,
  updateCategory,
  addCategory,
} from '../../../../hooks/useCategories';

import { Category } from '../../../../../commons/models/productConfiguration/CategoriesConfig';
import AddCategoryDialog from './AddCategoryDialog';

const CategoryListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<any>>();
  const onSelect = route.params?.onSelect as ((category: Category) => void) | undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(id);
          loadCategories();
        },
      },
    ]);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogVisible(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setDialogVisible(true);
  };

  const handleSave = async (category: Category) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, category);
    } else {
      await addCategory(category);
    }

    setDialogVisible(false);
    setEditingCategory(null);
    await loadCategories();

    // If in selection mode and it's a newly added category, auto-select it
    if (!editingCategory && onSelect) {
      const latest = (await fetchCategories()).slice(-1)[0];
      onSelect(latest);
      navigation.goBack();
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.center}>
            <Text>No categories found.</Text>
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  if (onSelect) {
                    onSelect(item);
                    navigation.goBack();
                  }
                }}
              >
                <View>
                  <Text style={styles.text}>{item.category}</Text>
                  <Text style={styles.subText}>{item.subCategory}</Text>
                </View>

                {!onSelect && (
                  <View style={styles.actions}>
                    <IconButton icon="pencil" onPress={() => handleEdit(item)} />
                    <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        )}

        <FAB style={styles.fab} icon="plus" onPress={handleAdd} label="Add Category" />

        <AddCategoryDialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          onSave={handleSave}
          initialCategory={editingCategory ?? undefined}
          title={editingCategory ? 'Edit Category' : 'Add Category'}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default CategoryListScreen;
