import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0f3460',
            borderTopColor: '#1a1a2e',
          },
          tabBarActiveTintColor: '#e94560',
          tabBarInactiveTintColor: '#8892b0',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Поиск',
            headerTitle: 'Films',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="lists"
          options={{
            title: 'Мои списки',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Премьеры',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="recommendations"
          options={{
            title: 'Рекомендации',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="movie/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
