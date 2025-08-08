import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/utils/theme';

export default function ScreenHeader({ title, subtitle, style = {} }) {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 60, ...style }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8
      }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: 16,
          fontWeight: '400',
          color: colors.textSecondary
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}