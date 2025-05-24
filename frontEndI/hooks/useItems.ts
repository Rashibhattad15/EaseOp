// hooks/useItems.ts
import { ref, get, child, set, update, remove, push } from 'firebase/database';
import { realtimedb } from '../firebaseConfig';
import { Item } from '../../commons/models/productConfiguration/ItemConfig';

/**
 * Custom hook to manage CRUD operations for items in Firebase Realtime Database.
 */
export const useItems = () => {
  /**
   * Adds a new item to the Firebase Realtime Database.
   * @param {Item} item - The item to be added.
   * @returns {Promise<void>} A promise that resolves when the item is added.
   */
const addItem = async (item: Item): Promise<void> => {
    try {
      const itemsRef = ref(realtimedb, 'productConfigurations/items');
      const newItemRef = push(itemsRef);
      item.id = newItemRef.key!; // Assign the generated key to the newItem's id
    set(newItemRef, item)
      .then(() => {
        console.log('Item added successfully');
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
      console.log('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  /**
   * Updates an existing item in the Firebase Realtime Database.
   * @param {string} itemId - The ID of the item to be updated.
   * @param {Partial<Item>} itemData - The partial data to update the item with.
   * @returns {Promise<void>} A promise that resolves when the item is updated.
   */
  const updateItem = async (itemId: string, itemData: Partial<Item>): Promise<void> => {
    try {
      const itemRef = ref(realtimedb, `productConfigurations/items/${itemId}`);
      await update(itemRef, itemData);
      console.log('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  /**
   * Deletes an item from the Firebase Realtime Database.
   * @param {string} itemId - The ID of the item to be deleted.
   * @returns {Promise<void>} A promise that resolves when the item is deleted.
   */
  const deleteItem = async (itemId: string): Promise<void> => {
    try {
      const itemRef = ref(realtimedb, `productConfigurations/items/${itemId}`);
      await remove(itemRef);
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const fetchItems = async () => {
    const dbRef = ref(realtimedb);
    try {
      const snapshot = await get(child(dbRef, 'productConfigurations/items'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object to array of items
        return Object.entries(data).map(([id, item]: any) => ({ id, ...item }));
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  };
  

  return { addItem, updateItem, deleteItem, fetchItems };
};