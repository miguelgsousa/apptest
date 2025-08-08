import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/utils/theme';

export default function ScreenLayout({ 
  children, 
  withTabBarSpacing = true,
  style = {},
  contentStyle = {} 
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      ...style
    }}>
      <StatusBar style={colors.statusBarStyle} />
      
      <View style={{
        flex: 1,
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        paddingBottom: withTabBarSpacing ? insets.bottom + 100 : insets.bottom + 20,
        ...contentStyle
      }}>
        {children}
      </View>
    </View>
  );
}