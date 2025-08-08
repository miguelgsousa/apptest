import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { List, Plus, Edit3, Trash2, Users, X } from 'lucide-react-native';
import { useFonts, InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { useTheme } from '@/utils/theme';

const predefinedColors = [
  '#6B5BFF', '#22C55E', '#FF6B6B', '#FFCE6A', '#1ECC45',
  '#8B7AFF', '#34D058', '#FF7B7B', '#FFD666', '#2EE55A'
];

export default function ListsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const [loaded, error] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_700Bold,
  });

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data.lists || []);
      } else {
        console.error('Failed to load lists:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingList(null);
    setListName('');
    setListDescription('');
    setSelectedColor(predefinedColors[0]);
    setModalVisible(true);
  };

  const openEditModal = (list) => {
    setEditingList(list);
    setListName(list.name);
    setListDescription(list.description || '');
    setSelectedColor(list.color);
    setModalVisible(true);
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    try {
      const method = editingList ? 'PUT' : 'POST';
      const body = editingList
        ? { id: editingList.id, name: listName, description: listDescription, color: selectedColor }
        : { name: listName, description: listDescription, color: selectedColor };

      const response = await fetch('/api/lists', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setModalVisible(false);
        loadLists();
        Alert.alert('Success', `List ${editingList ? 'updated' : 'created'} successfully!`);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || `Failed to ${editingList ? 'update' : 'create'} list`);
      }
    } catch (err) {
      console.error('Error saving list:', err);
      Alert.alert('Error', `Failed to ${editingList ? 'update' : 'create'} list. Please try again.`);
    }
  };

  const handleDeleteList = (list) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch('/api/lists', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: list.id }),
              });

              if (response.ok) {
                loadLists();
                Alert.alert('Success', 'List deleted successfully!');
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to delete list');
              }
            } catch (err) {
              console.error('Error deleting list:', err);
              Alert.alert('Error', 'Failed to delete list. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!loaded && !error) {
    return null;
  }

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
              fontFamily: 'InstrumentSans_700Bold',
              color: colors.text,
              marginBottom: 8
            }}>
              Account Lists
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: 'InstrumentSans_400Regular',
              color: colors.textSecondary,
              lineHeight: 24
            }}>
              Organize your TikTok accounts into custom lists
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

        {/* Lists */}
        {lists.length > 0 ? (
          <View style={{ gap: 12 }}>
            {lists.map((list) => (
              <View
                key={list.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: list.color,
                    marginRight: 12,
                  }} />
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontFamily: 'InstrumentSans_700Bold',
                      color: colors.text,
                      marginBottom: 2,
                    }}>
                      {list.name}
                    </Text>
                    
                    {list.description && (
                      <Text style={{
                        fontSize: 14,
                        fontFamily: 'InstrumentSans_400Regular',
                        color: colors.textSecondary,
                      }}>
                        {list.description}
                      </Text>
                    )}
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => openEditModal(list)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.primaryMuted,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Edit3 size={16} color={colors.primary} strokeWidth={1.5} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteList(list)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.danger + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={16} color={colors.danger} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}>
                  <Users size={14} color={colors.textSecondary} />
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'InstrumentSans_500Medium',
                    color: colors.textSecondary,
                    marginLeft: 6,
                  }}>
                    {list.account_count} account{list.account_count !== 1 ? 's' : ''}
                  </Text>
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
              <List size={32} color={colors.primary} strokeWidth={1.5} />
            </View>
            
            <Text style={{
              fontSize: 20,
              fontFamily: 'InstrumentSans_700Bold',
              color: colors.text,
              marginBottom: 8,
            }}>
              No lists yet
            </Text>
            
            <Text style={{
              fontSize: 16,
              fontFamily: 'InstrumentSans_400Regular',
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 24,
            }}>
              Create custom lists to organize your{'\n'}TikTok accounts by category or purpose
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
                fontFamily: 'InstrumentSans_600SemiBold',
                color: colors.background,
                marginLeft: 8,
              }}>
                Create First List
              </Text>
            </TouchableOpacity>
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
            minHeight: 400,
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
                fontFamily: 'InstrumentSans_700Bold',
                color: colors.text,
              }}>
                {editingList ? 'Edit List' : 'Create New List'}
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
                  fontFamily: 'InstrumentSans_500Medium',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  List Name
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
                    fontFamily: 'InstrumentSans_400Regular',
                    color: colors.text,
                  }}
                  placeholder="e.g. Content Creators"
                  placeholderTextColor={colors.textSecondary}
                  value={listName}
                  onChangeText={setListName}
                />
              </View>

              {/* Description Input */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'InstrumentSans_500Medium',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  Description (Optional)
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
                    fontFamily: 'InstrumentSans_400Regular',
                    color: colors.text,
                    minHeight: 80,
                  }}
                  placeholder="Brief description of this list"
                  placeholderTextColor={colors.textSecondary}
                  value={listDescription}
                  onChangeText={setListDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {/* Color Picker */}
              <View>
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'InstrumentSans_500Medium',
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
                    fontFamily: 'InstrumentSans_500Medium',
                    color: colors.text,
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveList}
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
                    fontFamily: 'InstrumentSans_600SemiBold',
                    color: colors.background,
                  }}>
                    {editingList ? 'Update List' : 'Create List'}
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