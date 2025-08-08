import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Tag, Plus, Edit3, Trash2, X } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';

const predefinedColors = [
  '#6B5BFF', '#22C55E', '#FF6B6B', '#FFCE6A', '#1ECC45',
  '#8B7AFF', '#34D058', '#FF7B7B', '#FFD666', '#2EE55A'
];

export default function TagsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      } else {
        console.error('Failed to load tags:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTag(null);
    setTagName('');
    setSelectedColor(predefinedColors[0]);
    setModalVisible(true);
  };

  const openEditModal = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setSelectedColor(tag.color);
    setModalVisible(true);
  };

  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      Alert.alert('Error', 'Please enter a tag name');
      return;
    }

    try {
      const method = editingTag ? 'PUT' : 'POST';
      const body = editingTag
        ? { id: editingTag.id, name: tagName, color: selectedColor }
        : { name: tagName, color: selectedColor };

      const response = await fetch('/api/tags', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setModalVisible(false);
        loadTags();
        Alert.alert('Success', `Tag ${editingTag ? 'updated' : 'created'} successfully!`);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || `Failed to ${editingTag ? 'update' : 'create'} tag`);
      }
    } catch (err) {
      console.error('Error saving tag:', err);
      Alert.alert('Error', `Failed to ${editingTag ? 'update' : 'create'} tag. Please try again.`);
    }
  };

  const handleDeleteTag = (tag) => {
    Alert.alert(
      'Delete Tag',
      `Are you sure you want to delete "${tag.name}"? This will remove it from all accounts.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch('/api/tags', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: tag.id }),
              });

              if (response.ok) {
                loadTags();
                Alert.alert('Success', 'Tag deleted successfully!');
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to delete tag');
              }
            } catch (err) {
              console.error('Error deleting tag:', err);
              Alert.alert('Error', 'Failed to delete tag. Please try again.');
            }
          },
        },
      ]
    );
  };

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8
            }}>
              Account Tags
            </Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '400',
              color: colors.textSecondary,
              lineHeight: 24
            }}>
              Create custom tags to categorize your accounts
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={openCreateModal}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Plus size={20} color={colors.background} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Tags */}
        {tags.length > 0 ? (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {tags.map((tag) => (
              <View
                key={tag.id}
                style={{
                  backgroundColor: tag.color + '20', // 20% opacity
                  borderWidth: 2,
                  borderColor: tag.color,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  minWidth: 120,
                }}
              >
                <Tag size={14} color={tag.color} strokeWidth={2} />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tag.color,
                  marginLeft: 8,
                  flex: 1,
                }}>
                  {tag.name}
                </Text>
                
                <View style={{ flexDirection: 'row', gap: 8, marginLeft: 8 }}>
                  <TouchableOpacity
                    onPress={() => openEditModal(tag)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: tag.color + '40',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Edit3 size={12} color={tag.color} strokeWidth={2} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteTag(tag)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: colors.danger + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={12} color={colors.danger} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primaryMuted,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Tag size={32} color={colors.primary} strokeWidth={1.5} />
            </View>
            
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8,
            }}>
              No tags yet
            </Text>
            
            <Text style={{
              fontSize: 16,
              fontWeight: '400',
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 24,
            }}>
              Create custom tags to categorize and{'\n'}organize your TikTok accounts
            </Text>

            <TouchableOpacity
              onPress={openCreateModal}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Plus size={18} color={colors.background} strokeWidth={2} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.background,
                marginLeft: 8,
              }}>
                Create First Tag
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Help Section */}
        {tags.length > 0 && (
          <View style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: colors.surfaceElevated,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 8,
            }}>
              💡 Pro Tip
            </Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '400',
              color: colors.textSecondary,
              lineHeight: 20,
            }}>
              Use tags like "High Growth", "Daily Poster", "Brand Account" to quickly identify different types of accounts in your main list.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create/Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: insets.bottom + 20,
            minHeight: 350,
          }}>
            {/* Modal Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.text,
              }}>
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </Text>
              
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.surfaceElevated,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={{ gap: 20 }}>
              {/* Name Input */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  Tag Name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    fontWeight: '400',
                    color: colors.text,
                  }}
                  placeholder="e.g. High Growth"
                  placeholderTextColor={colors.textSecondary}
                  value={tagName}
                  onChangeText={setTagName}
                />
              </View>

              {/* Color Picker */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.text,
                  marginBottom: 12,
                }}>
                  Color
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                }}>
                  {predefinedColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: color,
                        borderWidth: selectedColor === color ? 3 : 0,
                        borderColor: colors.background,
                        shadowColor: selectedColor === color ? color : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: selectedColor === color ? 4 : 0,
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Preview */}
              {tagName.trim() && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontFamily: 'InstrumentSans_500Medium',
                    color: colors.text,
                    marginBottom: 8,
                  }}>
                    Preview
                  </Text>
                  <View style={{
                    backgroundColor: selectedColor + '20',
                    borderWidth: 2,
                    borderColor: selectedColor,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                  }}>
                    <Tag size={14} color={selectedColor} strokeWidth={2} />
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'InstrumentSans_600SemiBold',
                      color: selectedColor,
                      marginLeft: 8,
                    }}>
                      {tagName}
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={{
                flexDirection: 'row',
                gap: 12,
                marginTop: 20,
              }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: colors.text,
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveTag}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.background,
                  }}>
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}