import React, { useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Appbar, FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ItemsListScreen from './ItemListScreen';
import CategoriesListScreen from './CategoriesListScreen';
import UnitsListScreen from './UnitsListScreen';
import AddUnitDialog from './AddUnitDialog';
import AddCategoryDialog from './AddCategoryDialog';
import AddItemDialog from './AddItemDialog';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

export default function ProductConfigurationScreen() {
    const Tab = createMaterialTopTabNavigator<{
        Items: undefined;
        Categories: undefined;
        Units: undefined;
      }>();
      
    const tabBarHeight = useBottomTabBarHeight();
    const navigation = useNavigation();     
  const [selectedTab, setSelectedTab] = useState('Items');

  const [appbarHeight, setAppbarHeight] = useState(0);

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        {/* <View onLayout={handleAppbarLayout}> */}
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Product Management" />
        </Appbar.Header>
        {/* </View> */}

        <View style={[styles.tabContainer, { marginTop: appbarHeight }]}>
        <Tab.Navigator
  initialRouteName="Items"
  screenListeners={{
    state: (e: { data: { state: { index: number; routeNames: string[] } } }) => {
      const index = e.data.state.index;
      const currentRoute = e.data.state.routeNames[index];
      console.log(currentRoute)
      setSelectedTab(currentRoute);
    },
  }}
>
            <Tab.Screen name="Items" component={ItemsListScreen} />
            <Tab.Screen name="Categories" component={CategoriesListScreen} />
            <Tab.Screen name="Units" component={UnitsListScreen} />
          </Tab.Navigator>
          </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
