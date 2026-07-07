import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabType = 'watchlist' | 'watched' | 'favorites';

interface Props {
  active: TabType;
  onChange: (tab: TabType) => void;
  counts: Record<TabType, number>;
}

const TABS: { key: TabType; label: string }[] = [
  { key: 'watchlist', label: 'Хочу посмотреть' },
  { key: 'watched', label: 'Просмотрено' },
  { key: 'favorites', label: 'Избранное' },
];

export default function ListTabs({ active, onChange, counts }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, active === tab.key && styles.tabActive]}
          onPress={() => onChange(tab.key)}
        >
          <Text style={[styles.tabText, active === tab.key && styles.tabTextActive]}>
            {tab.label} ({counts[tab.key]})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#e94560',
  },
  tabText: {
    color: '#8892b0',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
  },
});
