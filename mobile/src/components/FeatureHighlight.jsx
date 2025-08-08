import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/utils/theme';

export default function FeatureHighlight({ icon: Icon, text, iconSize = 16 }) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon size={iconSize} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={{
        fontSize: 14,
        fontFamily: 'InstrumentSans_400Regular',
        color: colors.textSecondary,
        flex: 1
      }}>
        {text}
      </Text>
    </View>
  );
}