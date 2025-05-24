import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import React from 'react';

const SearchBar = ({ search, setSearch }: { search: string; setSearch: (text: string) => void }) => (
  <TextInput
    style={styles.searchBar}
    placeholder="Search"
    value={search}
    onChangeText={setSearch}
    mode="outlined"
    left={<TextInput.Icon icon="magnify" />}
  />
);

const styles = StyleSheet.create({
  searchBar: {
    margin: 8,
  },
});

export default SearchBar;
