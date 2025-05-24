import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Appbar, Searchbar } from 'react-native-paper';
import { fetchCategories } from '../../../../hooks/useCategories';
import { Category } from '../../../../../commons/models/productConfiguration/CategoriesConfig';
import { SaudaPayload } from '@commons/models/productConfiguration/SaudaPayload';


export default function SelectCategoryScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
   const { manageState, mode } = useLocalSearchParams();
  const selectedItem = JSON.parse(manageState as string) as SaudaPayload;

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    };
    load();

    const filtered = categories.filter((cat) =>
      cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const { itemName, size, openingQuantity, rateDifference, category, unit } = useLocalSearchParams();

 
  const handleSelect = (selectedCategory: Category) => {
    // Inject selected category into the payload
    const updatedPayload = {
      ...selectedItem,
      category: selectedCategory,
    };

    if (mode === 'item') {
      router.replace({
        pathname: '/AddItemDialog',
        params: {
          item: JSON.stringify(updatedPayload),
        },
      });
    } else if (mode === 'sauda') {
      router.replace({
        pathname: '/(tabs)/(home)/(saudaEntry)/SaudaCreationScreen',
        params: {
          manageState: JSON.stringify(updatedPayload),
        },
      });
    } else {
      router.back();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Select Category" />
        {/* <Appbar.Action icon="plus" onPress={() => router.push('/AddCategoryScreen')} /> */}
      </Appbar.Header>

      <Searchbar
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredCategories.length === 0 ? (
          <View style={styles.center}>
            <Text>No categories found.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <View>
                  <Text style={styles.text}>{item.category}</Text>
                  <Text style={styles.subText}>{item.subCategory}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
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
});
