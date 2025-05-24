// services/categoryService.ts
import { ref, remove, update, get, child, push, set } from 'firebase/database';
import { realtimedb } from '../firebaseConfig';
import { Category } from '../../commons/models/productConfiguration/CategoriesConfig'; // adjust path if needed

// ✅ Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const dbRef = ref(realtimedb);
  try {
    const snapshot = await get(child(dbRef, 'productConfigurations/category'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, category]: any) => ({ id, ...category }));
    } else {
      console.log('No categories available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// ✅ Delete a category
export const deleteCategory = async (categoryId: string) => {
  if (!categoryId || categoryId.trim() === '') {
    console.log(categoryId)
    console.error('Invalid category ID provided for deletion.');
    return;
  }

  try {
    const categoryRef = ref(realtimedb, `productConfigurations/category/${categoryId}`);
    await remove(categoryRef);
    console.log(`Category ${categoryId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};


// ✅ Update a category
export const updateCategory = async (categoryId: string, updatedData: Omit<Category, 'id'>) => {
  try {
    const categoryRef = ref(realtimedb, `productConfigurations/category/${categoryId}`);
    await update(categoryRef, updatedData);
    console.log(`Category ${categoryId} updated successfully`);
  } catch (error) {
    console.error('Error updating category:', error);
  }
};


export const addCategory = async (category: Category) => {
  try {
    const categoriesRef = ref(realtimedb, 'productConfigurations/category');

    // Check if id is missing or empty and generate one
    const newCategoryRef = (!category.id || category.id.trim() === '')
      ? push(categoriesRef)
      : ref(realtimedb, `productConfigurations/category/${category.id}`);

    const id = newCategoryRef.key!;

    // Set the updated object with id
    const categoryWithId: Category = {
      ...category,
      id,
    };

    await set(newCategoryRef, categoryWithId);
    console.log(`Category "${category.category}" added successfully with id "${id}"`);
  } catch (error) {
    console.error('Error adding category:', error);
  }
};
