// screens/AddEditCustomerScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, HelperText } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CustomerConfiguration } from '../../../../../commons/models/customerConfiguration';
import { useCustomers } from '@/hooks/useCustomer';

const AddEditCustomerScreen: React.FC = () => {
  const router = useRouter();
  const { customer } = useLocalSearchParams();
  const selectedCustomer: CustomerConfiguration | null = customer
    ? JSON.parse(customer as string)
    : null;

  const [firstName, setFirstName] = useState(selectedCustomer?.firstName || '');
  const [lastName, setLastName] = useState(selectedCustomer?.lastName || '');
  const [contactNo, setContactNo] = useState(selectedCustomer?.contactNo || '');
  const [emailId, setEmailId] = useState(selectedCustomer?.emailId || '');
  const [address, setAddress] = useState(selectedCustomer?.address || '');
  const [city, setCity] = useState(selectedCustomer?.city || '');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    emailId: '',
    city: '',
  });

  const { addCustomer, updateCustomer } = useCustomers();

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      contactNo: '',
      emailId: '',
      city: '',
    };

    if (!firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    if (!contactNo.trim()) {
    newErrors.contactNo = 'Contact number is required';
    valid = false;
    } else if (!phoneRegex.test(contactNo)) {
    newErrors.contactNo = 'Enter a valid 10-digit mobile number';
    valid = false;
    }
    // if (!emailId) {
    //   newErrors.emailId = 'Email is required';
    //   valid = false;
    // }
    if (!city) {
      newErrors.city = 'City is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    const newCustomer: CustomerConfiguration = {
      id: selectedCustomer?.id || Date.now().toString(),
      firstName,
      lastName,
      contactNo,
      emailId,
      city,
      address,
    };

    try {
      if (selectedCustomer?.id) {
        await updateCustomer(selectedCustomer.id, newCustomer);
      } else {
        await addCustomer(newCustomer);
      }
      router.push('/');
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={selectedCustomer ? 'Edit Customer' : 'Add Customer'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          mode="outlined"
          error={!!errors.firstName}
        />
        {!!errors.firstName && <HelperText type="error">{errors.firstName}</HelperText>}

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          mode="outlined"
          error={!!errors.lastName}
        />
        {!!errors.lastName && <HelperText type="error">{errors.lastName}</HelperText>}

        <TextInput
          label="Contact No"
          value={contactNo}
          onChangeText={setContactNo}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
          error={!!errors.contactNo}
        />
        {!!errors.contactNo && <HelperText type="error">{errors.contactNo}</HelperText>}

        <TextInput
          label="Email ID"
          value={emailId}
          onChangeText={setEmailId}
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
          error={!!errors.emailId}
        />
        {!!errors.emailId && <HelperText type="error">{errors.emailId}</HelperText>}

        <TextInput
          label="City"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          mode="outlined"
          error={!!errors.city}
        />
        {!!errors.city && <HelperText type="error">{errors.city}</HelperText>}

        <TextInput
          label="Address (Optional)"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submit}
        >
          Save Customer
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12 },
  submit: { marginTop: 20 },
});

export default AddEditCustomerScreen;
