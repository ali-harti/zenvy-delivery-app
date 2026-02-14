import React, { useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { AppButton } from "../../shared/ui/AppButton";

// Adjust these imports to match your project tokens
import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";

// Adjust this import path to your auth store
import { useAuthStore } from "../../auth/store/auth.store";

const { width: SCREEN_W } = Dimensions.get("window");

type Slide = {
    key: "s1" | "s2" | "s3";
    image: any;
    title: string;
    subtitle: string;
    showFooterHint?: boolean;
};

const ONBOARDING_1_IMAGE = require("../../../assets/illustrations/onb1.png");
const ONBOARDING_2_IMAGE = require("../../../assets/illustrations/onb2.png");
const ONBOARDING_3_IMAGE = require("../../../assets/illustrations/onb3.png");

export default function CustomerOnboardingScreen() {
    const setNeedsCustomerOnboarding = useAuthStore(
        (s: any) => s.setNeedsCustomerOnboarding
    );

    const [index, setIndex] = useState(0);
    const listRef = useRef<FlatList>(null);

    // subtle animation on slide changes
    const anim = useRef(new Animated.Value(1)).current;

    const slides: Slide[] = useMemo(
        () => [
            {
                key: "s1",
                image: ONBOARDING_1_IMAGE,
                title: "Discover Thousands\nof Stores",
                subtitle:
                    "From restaurants to groceries,\npharmacies to flowers - find\neverything you need in one place",
            },
            {
                key: "s2",
                image: ONBOARDING_2_IMAGE,
                title: "Order in Just a Few Taps",
                subtitle:
                    "Browse products, add to cart, checkout\nsecurely. Your order is prepared and on its\nway in minutes",
            },
            {
                key: "s3",
                image: require("../../../assets/onboarding/onboarding-3.png"),
                title: "Track Your Order Live",
                subtitle:
                    "Know exactly where your order is. Get real-time\nupdates from preparation to your doorstep",
                showFooterHint: true,
            },
        ],
        []
    );

    function animateIn() {
        anim.setValue(0);
        Animated.timing(anim, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
        }).start();
    }

    function goTo(i: number) {
        const next = Math.max(0, Math.min(slides.length - 1, i));
        listRef.current?.scrollToOffset({ offset: next * SCREEN_W, animated: true });
        setIndex(next);
        animateIn();
    }

    function onSkip() {
        // End onboarding and let RootNavigator render CustomerNavigator
        setNeedsCustomerOnboarding(false);
    }

    function onNext() {
        if (index < slides.length - 1) {
            goTo(index + 1);
        } else {
            setNeedsCustomerOnboarding(false);
        }
    }

    return (
        <AppSafeScreen style={styles.safe}>
            {/* Top bar: dots + skip */}
            <View style={styles.topBar}>
                <AppButton
                    title="Skip"
                    variant="ghost"
                    onPress={onSkip}
                    textStyle={styles.skip}
                />
            </View>

            {/* Slides */}
            <FlatList
                ref={listRef}
                data={slides}
                keyExtractor={(s) => s.key}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                onMomentumScrollEnd={(e) => {
                    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
                    if (next !== index) {
                        setIndex(next);
                        animateIn();
                    }
                }}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width: SCREEN_W }]}>
                        <Animated.View
                            style={[
                                styles.animatedWrap,
                                {
                                    opacity: anim,
                                    transform: [
                                        {
                                            translateY: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [10, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Image
                                source={require("../../../assets/branding/zenvy-logo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>

                            <PrimaryButton
                                title={index === slides.length - 1 ? "Get Started" : "Next"}
                                onPress={onNext}
                                style={styles.cta}
                                textStyle={styles.ctaText} // Pass text style if you want to override default
                            />

                            {item.showFooterHint ? (
                                <Text style={styles.footerHint}>
                                    By continuing, you agree to our{" "}
                                    <Text style={styles.footerHintBold}>
                                        Terms & Privacy Policy
                                    </Text>
                                </Text>
                            ) : null}
                        </Animated.View>
                    </View>
                )}
            />
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.white,
    },

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: spacing.l,
        paddingTop: spacing.s,
        paddingBottom: spacing.s,
    },

    skip: {
        fontSize: 18, // Increased
        fontWeight: "700",
        color: colors.primary,
        textDecorationLine: 'none', // Override ghost default underline if needed, or keep it
    },

    slide: {
        flex: 1,
        paddingHorizontal: spacing.l,
    },

    animatedWrap: {
        flex: 1,
        alignItems: "center",
    },

    logo: {
        width: "90%",
        height: "45%", // Fill more vertical space
        marginTop: spacing.l,
        marginBottom: 0, // Remove gap between logo and text
    },

    title: {
        marginTop: spacing.s, // Bring text closer to logo
        textAlign: "center",
        fontSize: 32, // Slightly smaller to fit better if needed
        fontWeight: "800",
        color: colors.gray900,
        lineHeight: 38,
    },

    subtitle: {
        marginTop: spacing.m,
        textAlign: "center",
        fontSize: 18,
        color: colors.gray500,
        lineHeight: 26,
    },

    cta: {
        marginTop: spacing.xl ?? 28,
        width: "100%",
        // Height, borderRadius, bg, shadow handled by PrimaryButton
    },

    ctaText: {
        color: colors.white,
        fontSize: 22,
        fontWeight: "900",
    },

    footerHint: {
        marginTop: spacing.l,
        textAlign: "center",
        fontSize: 14,
        color: colors.gray500,
    },
    footerHintBold: {
        color: colors.gray700,
        fontWeight: "800",
    },
});
