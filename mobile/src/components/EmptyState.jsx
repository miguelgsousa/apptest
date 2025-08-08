import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/utils/theme';
import FeatureHighlight from './FeatureHighlight';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  features = [],
  iconSize = 48,
  style = {}
}) {
  const { colors } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop: 40,
      ...style
    }}>
      {/* Icon Container */}
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32
      }}>
        <Icon size={iconSize} color={colors.primary} strokeWidth={1.5} />
      </View>

      {/* Main Message */}
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 12
      }}>
        {title}
      </Text>

      {/* Description */}
      <Text style={{
        fontSize: 16,
        fontWeight: '400',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32
      }}>
        {description}
      </Text>

      {/* Feature Highlights */}
      {features.length > 0 && (
        <View style={{ width: '100%', gap: 16 }}>
          {features.map((feature, index) => (
            <FeatureHighlight
              key={index}
              icon={feature.icon}
              text={feature.text}
              iconSize={feature.iconSize}
            />
          ))}
        </View>
      )}
    </View>
  );
}