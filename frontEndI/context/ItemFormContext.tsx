// app/context/ItemFormContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Item } from '../../commons/models/productConfiguration/ItemConfig';

type ItemFormContextType = {
  editingItem: Item | null;
  setEditingItem: (item: Item | null) => void;
  saveItem: (item: Item) => void;
};

const ItemFormContext = createContext<ItemFormContextType | undefined>(undefined);

export const ItemFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [saveCallback, setSaveCallback] = useState<(item: Item) => void>(() => () => {});

  const saveItem = (item: Item) => {
    saveCallback(item);
  };

  return (
    <ItemFormContext.Provider value={{ editingItem, setEditingItem, saveItem }}>
      {children}
    </ItemFormContext.Provider>
  );
};

export const useItemForm = () => {
  const context = useContext(ItemFormContext);
  if (!context) throw new Error('useItemForm must be used within ItemFormProvider');
  return context;
};
