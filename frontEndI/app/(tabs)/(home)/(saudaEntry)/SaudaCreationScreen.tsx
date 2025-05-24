import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button, Checkbox, Divider, Appbar, Provider } from 'react-native-paper';
import { SaudaPayload } from "../../../../../commons/models/productConfiguration/SaudaPayload";
import { router, useLocalSearchParams } from 'expo-router';
import { useSaudaEntries } from '../../../../hooks/useSauda';
import { SaudaStatus } from '../../../../../commons/models/productConfiguration/SaudaStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SaudaCreationScreen() {
  const { manageState } = useLocalSearchParams();
  const [saudaId, setSaudaId] = useState(`SDA-${Date.now()}`);
  const [creationDate, setCreationDate] = useState(new Date().toISOString());
  const { saudaEntries, addSaudaEntry } = useSaudaEntries('officeId123');

  const createdBy = AsyncStorage.getItem('userName') as unknown as string;

  const [customer, setCustomer] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<any>({ id: 'Ton', unitName: 'Ton' });

  const [includeGST, setIncludeGST] = useState(false);
  const [includeLoading, setIncludeLoading] = useState(false);
  const [includeFOR, setIncludeFOR] = useState(false);

  const [saudaStatus, setSaudaStatus] = useState<SaudaStatus>("Pending");
  const [menuVisible, setMenuVisible] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (manageState) {
      try {
        const parsed = JSON.parse(manageState as string);
        if (parsed.saudaId) setSaudaId(parsed.saudaId);
        if (parsed.creationDate) setCreationDate(parsed.creationDate);
        if (parsed.customer) setCustomer(parsed.customer);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.rate !== undefined) setRate(parsed.rate.toString());
        if (parsed.quantity !== undefined) setQuantity(parsed.quantity.toString());
        if (parsed.unit) setUnit(parsed.unit);
        if (parsed.includeGST !== undefined) setIncludeGST(parsed.includeGST);
        if (parsed.includeLoading !== undefined) setIncludeLoading(parsed.includeLoading);
        if (parsed.includeFOR !== undefined) setIncludeFOR(parsed.includeFOR);
        if (parsed.saudaStatus) setSaudaStatus(parsed.saudaStatus);
      } catch (e) {
        console.warn('Failed to parse sauda param:', e);
      }
    }
  }, [manageState]);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customer) newErrors.customer = 'Customer is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!rate || isNaN(parseFloat(rate))) newErrors.rate = 'Valid rate is required.';
    if (!quantity || isNaN(parseFloat(quantity))) newErrors.quantity = 'Valid quantity is required.';
    if (!unit || !unit.unitName) newErrors.unit = 'Unit is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    const payload: SaudaPayload = {
      createdBy,
      saudaId,
      creationDate,
      category,
      rate: parseFloat(rate) || 0,
      quantity,
      quantityUnit: unit,
      saudaStatus,
      updatedAt: Date.now().toString(),
      includeGST,
      includeLoading,
      includeFOR,
      customer
    };

    try {
      // Add the Sauda entry to Firebase
      const addedSauda = await addSaudaEntry({
        createdBy,
        saudaId,
        creationDate,
        category,
        rate: parseFloat(rate) || 0,
        quantity,
        quantityUnit: unit,
        saudaStatus,
        includeGST,
        includeLoading,
        includeFOR,
        customer
      });

      router.back()
    } catch (error) {
      console.error('Failed to submit Sauda entry:', error);
    }
  };

  return (
    <Provider>
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Create Sauda" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            label="Order ID"
            value={saudaId}
            editable={false} // Instead of `disabled`
            style={[styles.input, styles.nonEditable]}
            theme={{
              colors: {
                primary: '#6200ee',     // Active underline & label
                text: '#000000',        // Text inside the input
                placeholder: '#6200ee', // Label color
                background: '#ffffff',  // Input background
              },
            }}
          />

          <TextInput
            label="Customer"
            value={customer?.firstName ?? ''}
            onPressIn={() => {
              router.push({
                pathname: '/(tabs)/(configurations)/(customerconfiguration)/SelectCustomer',
                params: {
                  manageState: JSON.stringify({
                    saudaId,
                    creationDate,
                    category,
                    rate,
                    quantity,
                    unit,
                    saudaStatus,
                    includeGST,
                    includeLoading,
                    includeFOR,
                  }),
                },
              });
            }}
            placeholder="Select Customer"
            style={[styles.input, styles.whiteBackground]}
            
            error={!!errors.customer}
          />
          {errors.customer && <Text style={styles.errorText}>{errors.customer}</Text>}

          <TextInput
            label="Category"
            value={category?.category ?? ''}
            onPressIn={() => {
              router.push({
                pathname: '/(tabs)/(configurations)/(productconfiguration)/SelectCategory',
                params: {
                  mode: 'sauda',
                  manageState: JSON.stringify({
                    saudaId,
                    creationDate,
                    customer,
                    rate,
                    quantity,
                    unit,
                    saudaStatus,
                    includeGST,
                    includeLoading,
                    includeFOR,
                  }),
                },
              });
            }}
            placeholder="Select Category"
            style={[styles.input, styles.whiteBackground]}
            error={!!errors.category}
          />
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          <TextInput
            label="Rate"
            value={rate}
            onChangeText={setRate}
            keyboardType="numeric"
            style={[styles.input, styles.whiteBackground]}
            error={!!errors.rate}
          />

          {errors.rate && <Text style={styles.errorText}>{errors.rate}</Text>}

          <View style={styles.row}>
            <TextInput
              label="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={[styles.input, { flex: 0.6, marginRight: 8 }, styles.whiteBackground]}
              error={!!errors.quantity}
            />
            <TextInput
              label="Unit"
              value={unit?.unitName ?? ''}
              onPressIn={() => {
                // Navigate to Unit screen
              }}
              placeholder="Select Unit"
              style={[styles.input, { flex: 0.4 }, styles.whiteBackground]}
              error={!!errors.unit}
            />
          </View>
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
          {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}

          <View style={styles.checkboxRow}>
            <Checkbox.Item
              label="Include GST"
              status={includeGST ? 'checked' : 'unchecked'}
              onPress={() => setIncludeGST(!includeGST)}
              color="#6200ee"
              labelStyle={styles.checkboxLabel}
            />
            <Checkbox.Item
              label="Include Loading"
              status={includeLoading ? 'checked' : 'unchecked'}
              onPress={() => setIncludeLoading(!includeLoading)}
              color="#6200ee"
              labelStyle={styles.checkboxLabel}
            />
          </View>

          <View style={styles.checkboxRow}>
          <Checkbox.Item
            label="Include FOR"
            status={includeFOR ? 'checked' : 'unchecked'}
            onPress={() => setIncludeFOR(!includeFOR)}
            color="#6200ee"
            labelStyle={styles.checkboxLabel}
          />
          </View>

          <TouchableOpacity
            disabled={true}
            style={[styles.menuTrigger, { opacity: 0.5 }]}
          >
            <Text style={styles.menuText}>Sauda Status: {saudaStatus}</Text>
          </TouchableOpacity>

          <Divider style={{ marginVertical: 12 }} />

          <Button mode="contained" onPress={handleSubmit}>
            Submit Sauda
          </Button>
        </ScrollView>
      </>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12 },
  whiteBackground: {
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', marginBottom: 12 },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkboxLabel: {
    color: '#6200ee',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  menuTrigger: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  highlightedInput: {
    color: '#000', // Black text for better contrast and visibility
    fontWeight: 'bold', // Bold text for emphasis
    borderColor: '#6200ee', // Strong border color (purple)
  },
  transparentBackground: {
    backgroundColor: 'transparent', // Remove white background
  },
  nonEditable: {
    opacity: 1, // Ensure full opacity
  },

});