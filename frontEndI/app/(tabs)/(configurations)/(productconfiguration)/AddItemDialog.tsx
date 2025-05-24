import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, HelperText } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Category } from '../../../../../commons/models/productConfiguration/CategoriesConfig';
import { Unit } from '../../../../../commons/models/productConfiguration/UnitConfig';
import { Item } from '../../../../../commons/models/productConfiguration/ItemConfig';
import { useItems } from '@/hooks/useItems';

export default function AddItemScreen() {
  const router = useRouter();
  const { state } = useLocalSearchParams();
  const selectedItem: Item | null = state ? JSON.parse(state as string) : null;

  const [itemName, setItemName] = useState(selectedItem?.itemName || '');
  const [size, setSize] = useState(selectedItem?.size || '');
  const [openingQuantity, setOpeningQuantity] = useState(
    selectedItem?.openingQuantity?.toString() || ''
  );
  const [rateDifference, setRateDifference] = useState(
    selectedItem?.rateDifference?.toString() || ''
  );
  const [category, setCategory] = useState<Category | null>(
    selectedItem?.category || null
  );
  const [unit, setUnit] = useState<Unit | null>(selectedItem?.unit || null);
  const [loading, setLoading] = useState(false);

  // State to manage error messages
  const [errors, setErrors] = useState({
    itemName: '',
    size: '',
    openingQuantity: '',
    rateDifference: '',
    category: '',
    unit: '',
  });

  const { addItem, updateItem } = useItems();

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      itemName: '',
      size: '',
      openingQuantity: '',
      rateDifference: '',
      category: '',
      unit: '',
    };

    if (!itemName) {
      newErrors.itemName = 'Item Name is required';
      valid = false;
    }
    if (!size) {
      newErrors.size = 'Size is required';
      valid = false;
    }
    if (!openingQuantity) {
      newErrors.openingQuantity = 'Opening Quantity is required';
      valid = false;
    }
    if (!rateDifference) {
      newErrors.rateDifference = 'Rate Difference is required';
      valid = false;
    }
    if (!category) {
      newErrors.category = 'Category is required';
      valid = false;
    }
    if (!unit) {
      newErrors.unit = 'Unit is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    const newItem: Item = {
      id: selectedItem?.id || Date.now().toString(),
      itemName,
      size,
      openingQuantity: Number(openingQuantity),
      rateDifference: Number(rateDifference),
      category: category!,
      unit: unit!,
    };

    try {
      if (selectedItem?.id) {
        await updateItem(selectedItem.id, newItem);
      } else {
        await addItem(newItem);
      }
      router.push('/ItemListScreen');
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategory = () => {
    const itemState: Item = {
      id: selectedItem?.id || Date.now().toString(),
      itemName,
      size,
      openingQuantity: Number(openingQuantity),
      rateDifference: Number(rateDifference),
      category: category!,
      unit: unit!,
    };

    router.push({
      pathname: '/SelectCategory',
      params: {
        state: JSON.stringify(itemState),
      },
    });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={selectedItem ? 'Edit Item' : 'Add Item'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Item Name"
          value={itemName}
          onChangeText={setItemName}
          style={styles.input}
          mode="outlined"
          error={!!errors.itemName}
        />
        {!!errors.itemName && (
          <HelperText type="error">{errors.itemName}</HelperText>
        )}

        <TextInput
          label="Size"
          value={size}
          onChangeText={setSize}
          style={styles.input}
          mode="outlined"
          error={!!errors.size}
        />
        {!!errors.size && <HelperText type="error">{errors.size}</HelperText>}

        <TextInput
          label="Opening Quantity"
          value={openingQuantity}
          onChangeText={setOpeningQuantity}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          error={!!errors.openingQuantity}
        />
        {!!errors.openingQuantity && (
          <HelperText type="error">{errors.openingQuantity}</HelperText>
        )}

        <TextInput
          label="Rate Difference"
          value={rateDifference}
          onChangeText={setRateDifference}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          error={!!errors.rateDifference}
        />
        {!!errors.rateDifference && (
          <HelperText type="error">{errors.rateDifference}</HelperText>
        )}

        <Button
          mode="outlined"
          onPress={navigateToCategory}
          style={styles.selector}
          icon="shape"
        >
          {category ? category.category : 'Select Category'}
        </Button>
        {!!errors.category && (
          <HelperText type="error">{errors.category}</HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submit}
          loading={loading}
          disabled={loading}
        >
          Save Item
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12 },
  selector: { marginVertical: 10 },
  submit: { marginTop: 20 },
});
