import React from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, Moon, Sun, Palette, Bell, Info, ChevronRight } from 'lucide-react-native';
import { useFonts, InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { useTheme } from '@/utils/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, themePreference, setThemePreference, isDark } = useTheme();

  const [loaded, error] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_700Bold,
  });

  if (!loaded && !error) {
    return null;
  }

  const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightComponent, isLast = false }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.surface,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <Icon size={20} color={colors.primary} strokeWidth={1.5} />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: 'InstrumentSans_500Medium',
          color: colors.text,
          marginBottom: 2,
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{
            fontSize: 14,
            fontFamily: 'InstrumentSans_400Regular',
            color: colors.textSecondary,
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent || (
        <ChevronRight size={20} color={colors.textSecondary} strokeWidth={1.5} />
      )}
    </TouchableOpacity>
  );

  const ThemeSelector = () => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 20,
      overflow: 'hidden',
    }}>
      {[
        { key: 'system', label: 'System', icon: Palette, subtitle: 'Follow device setting' },
        { key: 'light', label: 'Light', icon: Sun, subtitle: 'Always use light theme' },
        { key: 'dark', label: 'Dark', icon: Moon, subtitle: 'Always use dark theme' },
      ].map((option, index) => (
        <SettingItem
          key={option.key}
          icon={option.icon}
          title={option.label}
          subtitle={option.subtitle}
          onPress={() => setThemePreference(option.key)}
          rightComponent={
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: themePreference === option.key ? colors.primary : colors.border,
              backgroundColor: themePreference === option.key ? colors.primary : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {themePreference === option.key && (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.surface,
                }} />
              )}
            </View>
          }
          isLast={index === 2}
        />
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBarStyle} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 28,
            fontFamily: 'InstrumentSans_700Bold',
            color: colors.text,
            marginBottom: 8
          }}>
            Settings
          </Text>
          <Text style={{
            fontSize: 16,
            fontFamily: 'InstrumentSans_400Regular',
            color: colors.textSecondary,
            lineHeight: 24
          }}>
            Customize your TikTok tracking experience
          </Text>
        </View>

        {/* Theme Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'InstrumentSans_600SemiBold',
            color: colors.text,
            marginBottom: 12,
          }}>
            Appearance
          </Text>
          <ThemeSelector />
        </View>

        {/* Notifications Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'InstrumentSans_600SemiBold',
            color: colors.text,
            marginBottom: 12,
          }}>
            Notifications
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <SettingItem
              icon={Bell}
              title="Push Notifications"
              subtitle="Get notified about follower milestones"
              rightComponent={
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              }
              isLast={true}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 18,
            fontFamily: 'InstrumentSans_600SemiBold',
            color: colors.text,
            marginBottom: 12,
          }}>
            About
          </Text>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            <SettingItem
              icon={Info}
              title="App Information"
              subtitle="Version 1.0.0"
              onPress={() => {}}
              isLast={true}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}