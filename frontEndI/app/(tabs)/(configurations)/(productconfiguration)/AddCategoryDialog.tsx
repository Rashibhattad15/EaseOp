import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { Category } from '../../../../../commons/models/productConfiguration/CategoriesConfig';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  initialCategory?: Category;
  onSave: (category: Category) => void;
  title: string;
}

export default function AddCategoryDialog({
  visible,
  onDismiss,
  initialCategory,
  onSave,
  title,
}: Props) {
  const [categoryName, setCategoryName] = useState('');
  const [subCategory, setSubCategory] = useState('');

  useEffect(() => {
    if (visible && initialCategory) {
      setCategoryName(initialCategory.category);
      setSubCategory(initialCategory.subCategory);
    } else if (visible) {
      setCategoryName('');
      setSubCategory('');
    }
  }, [visible, initialCategory]);

  const handleSave = () => {
    const category: Category = {
      id: initialCategory?.id || '',
      category: categoryName.trim(),
      subCategory: subCategory.trim() || 'Primary', // default fallback
    };

    onSave(category);
    setCategoryName('');
    setSubCategory('');
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.centerText}>{title}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Category Name"
            value={categoryName}
            onChangeText={setCategoryName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Sub Category"
            value={subCategory}
            onChangeText={setSubCategory}
            mode="outlined"
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSave} disabled={!categoryName.trim()}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
  },
  centerText: {
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
