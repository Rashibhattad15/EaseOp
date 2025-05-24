import React, { useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Appbar, FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CategoriesListScreen from '../(configurations)/(productconfiguration)/CategoriesListScreen';
import UnitsListScreen from '../(configurations)/(productconfiguration)/UnitsListScreen';
import SaudaEntry from './(saudaEntry)/index';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  // useEffect(() => {
  //   console.log("Checking internet connection...");
  // }, []);

  
    const Tab = createMaterialTopTabNavigator<{
      SaudaEntry: undefined;
      OrderCreation: undefined;
      DispatchEntry: undefined;
      }>();
      
    const tabBarHeight = useBottomTabBarHeight();
    const navigation = useNavigation();     
  const [selectedTab, setSelectedTab] = useState('SaudaEntry');

  const [appbarHeight, setAppbarHeight] = useState(0);

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          {/* <Appbar.BackAction onPress={() => navigation.goBack()} /> */}
          <Appbar.Content title="Home" />
        </Appbar.Header>
        <View style={[styles.tabContainer, { marginTop: appbarHeight }]}>
        <Tab.Navigator
  initialRouteName="SaudaEntry"
  screenListeners={{
    state: (e: { data: { state: { index: number; routeNames: string[] } } }) => {
      const index = e.data.state.index;
      const currentRoute = e.data.state.routeNames[index];
      setSelectedTab(currentRoute);
    },
  }}
>
            <Tab.Screen name="SaudaEntry" component={SaudaEntry} />
            <Tab.Screen name="OrderCreation" component={CategoriesListScreen} />
            <Tab.Screen name="DispatchEntry" component={UnitsListScreen} />
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
