import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  Menu,
  Bell,
  Search,
  Plus,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  Play,
  Tag,
} from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import EmptyState from "@/components/EmptyState";

export default function TikTokAccounts() {
  const insets = useSafeAreaInsets();
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const { colors } = useTheme();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await fetch("/api/tiktok-accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      } else {
        console.error("Failed to load accounts:", response.statusText);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
      setAccounts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Update all account stats before refreshing the list
    try {
      await fetch("/api/tiktok-accounts/update-stats", { method: "PUT" });
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
    await loadAccounts();
    setRefreshing(false);
  };

  const formatFollowers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatGrowth = (growth) => {
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${formatFollowers(Math.abs(growth))}`;
  };

  const features = [
    {
      icon: Users,
      text: "Track follower growth in real-time",
    },
    {
      icon: CheckCircle,
      text: "Monitor daily posting activity",
    },
    {
      icon: TrendingUp,
      text: "View growth analytics and trends",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBarStyle} />

      {/* Fixed Header */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: colors.background,
          borderBottomWidth: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
          borderBottomColor: colors.border,
        }}
      >
        {/* Top Utility Bar */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surface,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Menu size={20} color={colors.text} strokeWidth={1.5} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/add-account")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Plus size={20} color={colors.background} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Bell size={20} color={colors.text} strokeWidth={1.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Search size={20} color={colors.text} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Headline */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.text,
              lineHeight: 28,
            }}
          >
            Track your TikTok growth &{"\n"}stay on top of posting
          </Text>
        </View>
      </Animated.View>

      {/* Account Cards or Empty State */}
      {accounts.length > 0 ? (
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 16 + 44 + 16 + 56 + 24, // Header height
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        >
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              onPress={() => router.push(`/account-details/${account.id}`)}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* Header with Profile */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Image
                  source={{ uri: account.profile_image_url }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    marginRight: 12,
                  }}
                  contentFit="cover"
                  transition={200}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: colors.text,
                      marginBottom: 4,
                    }}
                  >
                    {account.username}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Eye size={14} color={colors.textSecondary} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.textSecondary,
                        marginLeft: 4,
                      }}
                    >
                      {formatFollowers(account.followers)} followers
                    </Text>
                  </View>

                  {/* Last Video Views */}
                  {account.last_video_views > 0 && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Play size={14} color={colors.textSecondary} />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "400",
                          color: colors.textSecondary,
                          marginLeft: 4,
                        }}
                      >
                        {formatViews(account.last_video_views)} views last video
                      </Text>
                    </View>
                  )}
                </View>

                {/* Posting Status */}
                <View
                  style={{
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {account.posted_today ? (
                    <CheckCircle size={24} color={colors.success} />
                  ) : (
                    <Clock size={24} color={colors.textSecondary} />
                  )}
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: account.posted_today
                        ? colors.success
                        : colors.textSecondary,
                    }}
                  >
                    {account.posted_today ? "Posted" : "Pending"}
                  </Text>
                </View>
              </View>

              {/* Tags */}
              {account.tags && account.tags.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                    marginBottom: 16,
                  }}
                >
                  {account.tags.map((tag) => (
                    <View
                      key={tag.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: tag.color + "20", // 20% opacity
                        borderWidth: 1,
                        borderColor: tag.color,
                        borderRadius: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <Tag size={10} color={tag.color} strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "500",
                          color: tag.color,
                          marginLeft: 4,
                        }}
                      >
                        {tag.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Growth Stats */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TrendingUp
                    size={16}
                    color={
                      account.follower_growth >= 0
                        ? colors.success
                        : colors.danger
                    }
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color:
                        account.follower_growth >= 0
                          ? colors.success
                          : colors.danger,
                      marginLeft: 6,
                    }}
                  >
                    {formatGrowth(account.follower_growth)} today
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: colors.textSecondary,
                  }}
                >
                  Last updated:{" "}
                  {new Date(account.last_updated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 16 + 44 + 16 + 56 + 24, // Header height
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
        >
          <EmptyState
            icon={Users}
            title="No TikTok accounts yet"
            description="Start tracking your TikTok growth by adding your first account. Monitor followers and posting activity all in one place."
            features={features}
          />
        </View>
      )}
    </View>
  );
}
