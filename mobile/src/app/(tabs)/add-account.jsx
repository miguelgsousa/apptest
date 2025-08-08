import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Plus, User, Check } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function AddAccount() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddAccount = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a TikTok username');
      return;
    }

    // Ensure username starts with @
    const formattedUsername = username.startsWith('@') ? username : `@${username}`;

    setLoading(true);
    try {
      const response = await fetch('/api/tiktok-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formattedUsername,
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Success',
          'TikTok account added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setUsername('');
                router.push('/(tabs)');
              },
            },
          ]
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to add account');
      }
    } catch (err) {
      console.error('Error adding account:', err);
      Alert.alert('Error', 'Failed to add account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={colors.statusBarStyle} />
        
        <View style={{
          flex: 1,
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}>
          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8
            }}>
              Add TikTok Account
            </Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '400',
              color: colors.textSecondary,
              lineHeight: 24
            }}>
              Start tracking follower growth and posting activity for a new TikTok account.
            </Text>
          </View>

          {/* Icon Container */}
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primaryMuted,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginBottom: 32
          }}>
            <Plus size={40} color={colors.primary} strokeWidth={1.5} />
          </View>

          {/* Form */}
          <View style={{ gap: 24 }}>
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: colors.text,
                marginBottom: 8
              }}>
                TikTok Username
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 16,
                minHeight: 52,
              }}>
                <User size={20} color={colors.textSecondary} strokeWidth={1.5} />
                <TextInput
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: '400',
                    color: colors.text,
                    marginLeft: 12,
                  }}
                  placeholder="Enter username (e.g., @username)"
                  placeholderTextColor={colors.textSecondary}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleAddAccount}
                />
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '400',
                color: colors.textSecondary,
                marginTop: 8
              }}>
                The @ symbol will be added automatically if not included
              </Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={handleAddAccount}
              disabled={loading || !username.trim()}
              style={{
                backgroundColor: loading || !username.trim() ? colors.borderMuted : colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: loading || !username.trim() ? 0 : 0.15,
                shadowRadius: 3,
                elevation: loading || !username.trim() ? 0 : 3,
              }}
            >
              {loading ? (
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.textSecondary,
                }}>
                  Adding Account...
                </Text>
              ) : (
                <>
                  <Check size={20} color={colors.background} strokeWidth={2} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.background,
                    marginLeft: 8,
                  }}>
                    Add Account
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.text,
              marginBottom: 12
            }}>
              How it works
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '400',
              color: colors.textSecondary,
              lineHeight: 20
            }}>
              Once added, we'll start tracking follower count and posting activity. The account will appear on your main screen with real-time growth metrics and daily posting status.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}