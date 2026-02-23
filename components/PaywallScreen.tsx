import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { colors } from "../utils/theme";
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  PaywallPackage,
} from "../utils/purchases";

interface PaywallScreenProps {
  onPurchased: () => void;
  onClose: () => void;
}

const FEATURES = [
  { emoji: "🏔️", text: "Unlimited mountains — track every habit" },
  { emoji: "🌋", text: "6 stunning mountain themes" },
  { emoji: "📊", text: "Weekly analytics & relapse patterns" },
  { emoji: "🏆", text: "Trophy room for conquered habits" },
  { emoji: "🔔", text: "Daily reminder notifications" },
  { emoji: "📅", text: "Full 66-day activity history" },
  { emoji: "📤", text: "Export your data" },
];

export function PaywallScreen({ onPurchased, onClose }: PaywallScreenProps) {
  const [packages, setPackages] = useState<PaywallPackage[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(1); // default to yearly
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    getOfferings().then(setPackages);
  }, []);

  const handlePurchase = async () => {
    if (!packages[selectedIdx]) return;
    setPurchasing(true);
    const success = await purchasePackage(packages[selectedIdx]);
    setPurchasing(false);
    if (success) {
      onPurchased();
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const restored = await restorePurchases();
    setRestoring(false);
    if (restored) {
      onPurchased();
    } else {
      Alert.alert("No purchases found", "We couldn't find any previous purchases to restore.");
    }
  };

  const savings =
    packages.length >= 2
      ? Math.round((1 - packages[1].priceValue / (packages[0].priceValue * 12)) * 100)
      : 50;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      {/* Header */}
      <Animated.View entering={FadeIn.delay(100).duration(600)}>
        <Text style={styles.badge}>PRO</Text>
        <Text style={styles.title}>Unlock UnMount Pro</Text>
        <Text style={styles.subtitle}>
          Everything you need to conquer every habit.
        </Text>
      </Animated.View>

      {/* Features */}
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.featureList}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Pricing cards */}
      <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.pricingSection}>
        {packages.map((pkg, i) => {
          const isSelected = i === selectedIdx;
          const isYearly = pkg.period === "annual";
          return (
            <TouchableOpacity
              key={pkg.id}
              onPress={() => setSelectedIdx(i)}
              activeOpacity={0.8}
              style={[
                styles.priceCard,
                isSelected && styles.priceCardSelected,
              ]}
            >
              {isYearly && (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>SAVE {savings}%</Text>
                </View>
              )}
              <Text style={[styles.priceTitle, isSelected && styles.priceTitleSelected]}>
                {pkg.title}
              </Text>
              <Text style={[styles.priceAmount, isSelected && styles.priceAmountSelected]}>
                {pkg.price}
              </Text>
              <Text style={styles.pricePeriod}>
                {pkg.period === "monthly"
                  ? "/month"
                  : pkg.period === "annual"
                  ? "/year"
                  : "one time"}
              </Text>
              {isYearly && (
                <Text style={styles.priceSubDetail}>
                  Just {(pkg.priceValue / 12).toFixed(2)}/mo
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Purchase button */}
      <Animated.View entering={FadeIn.delay(700).duration(600)}>
        <TouchableOpacity
          style={styles.purchaseBtn}
          onPress={handlePurchase}
          activeOpacity={0.8}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color={colors.bg.primary} />
          ) : (
            <Text style={styles.purchaseBtnText}>
              {packages[selectedIdx]?.period === "lifetime"
                ? "Buy Lifetime Access"
                : "Start Free Trial"}
            </Text>
          )}
        </TouchableOpacity>

        {packages[selectedIdx]?.period !== "lifetime" && (
          <Text style={styles.trialNote}>
            7-day free trial, then {packages[selectedIdx]?.price}
            {packages[selectedIdx]?.period === "monthly" ? "/mo" : "/yr"}. Cancel
            anytime.
          </Text>
        )}

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={restoring}
          activeOpacity={0.7}
        >
          <Text style={styles.restoreBtnText}>
            {restoring ? "Restoring..." : "Restore Purchases"}
          </Text>
        </TouchableOpacity>

        {/* Legal links */}
        <View style={styles.legalRow}>
          <Text style={styles.legalText}>Terms of Use</Text>
          <Text style={styles.legalDot}>·</Text>
          <Text style={styles.legalText}>Privacy Policy</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeBtnText: {
    color: colors.text.muted,
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "800",
    color: "#0c1220",
    backgroundColor: colors.accent.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 1.5,
    overflow: "hidden",
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 28,
  },
  featureList: {
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  featureEmoji: {
    fontSize: 18,
    width: 32,
  },
  featureText: {
    fontSize: 15,
    color: colors.text.primary,
    flex: 1,
  },
  pricingSection: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  priceCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    position: "relative",
  },
  priceCardSelected: {
    borderColor: colors.accent.green,
    backgroundColor: "rgba(74,187,135,0.06)",
  },
  saveBadge: {
    position: "absolute",
    top: -10,
    backgroundColor: colors.accent.yellow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  priceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.muted,
    marginBottom: 6,
    marginTop: 4,
  },
  priceTitleSelected: {
    color: colors.text.primary,
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  priceAmountSelected: {
    color: colors.text.primary,
  },
  pricePeriod: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
  },
  priceSubDetail: {
    fontSize: 11,
    color: colors.accent.greenLight,
    marginTop: 4,
    fontWeight: "600",
  },
  purchaseBtn: {
    backgroundColor: colors.accent.green,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  purchaseBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.bg.primary,
    letterSpacing: 0.3,
  },
  trialNote: {
    textAlign: "center",
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 16,
    lineHeight: 18,
  },
  restoreBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 12,
  },
  restoreBtnText: {
    fontSize: 14,
    color: colors.text.muted,
    textDecorationLine: "underline",
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  legalText: {
    fontSize: 12,
    color: colors.text.dimmed,
  },
  legalDot: {
    fontSize: 12,
    color: colors.text.dimmed,
  },
});
