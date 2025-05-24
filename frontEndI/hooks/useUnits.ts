// services/unitService.ts
import { ref, remove, update, get, child, push, set } from 'firebase/database';
import { realtimedb } from '../firebaseConfig';

// Already existing
export const fetchUnits = async () => {
  const dbRef = ref(realtimedb);
  try {
    const snapshot = await get(child(dbRef, 'productConfigurations/units'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, unit]: any) => ({ id, ...unit }));
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

// ✅ Delete a unit
export const deleteUnit = async (unitId: string) => {
  try {
    const unitRef = ref(realtimedb, `productConfigurations/units/${unitId}`);
    await remove(unitRef);
    console.log(`Unit ${unitId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting unit:', error);
  }
};


// ✅ Edit or update a unit
export const updateUnit = async (unitId: string, updatedData: { unitName: string }) => {
  try {
    const unitRef = ref(realtimedb, `productConfigurations/units/${unitId}`);
    await update(unitRef, updatedData);
    console.log(`Unit ${unitId} updated successfully`);
  } catch (error) {
    console.error('Error updating unit:', error);
  }
};


export const addUnit = async (unit: { unitName: string }) => {
  try {
    const unitsRef = ref(realtimedb, 'productConfigurations/units');
    const newUnitRef = push(unitsRef); // creates a new unique ID
    await set(newUnitRef, unit); // saves the unit with the auto-generated ID
    console.log(`Unit "${unit.unitName}" added successfully`);
  } catch (error) {
    console.error('Error adding unit:', error);
  }
};
