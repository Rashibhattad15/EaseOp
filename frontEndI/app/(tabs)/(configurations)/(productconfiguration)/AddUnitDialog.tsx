import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  initialUnitName?: string;
  onSave: (unitName: string) => void;
  title: string
}

export default function AddUnitDialog({
  visible,
  onDismiss,
  initialUnitName = '',
  onSave,
  title
  
}: Props) {
  const [unitName, setUnitName] = useState(initialUnitName);

  useEffect(() => {
    if (visible && initialUnitName !== unitName) {
      setUnitName(initialUnitName);
    }
  }, [visible]);
  

  const handleSave = () => {
    if (unitName.trim()) {
      onSave(unitName.trim());
      setUnitName('');
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.centerText}>{title}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Unit Name"
            value={unitName}
            onChangeText={setUnitName}
            mode="outlined"
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSave} disabled={!unitName.trim()}>
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
