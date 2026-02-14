import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Animated,
    Easing,
} from "react-native";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { OutlineButton } from "../../shared/ui/OutlineButton";
import { colors } from "../../shared/theme/colors";

type Props = {
    navigation: any;
};

export default function WelcomeScreen({ navigation }: Props) {
    // Subtle entrance animation (keeps exact layout, just fades/slides in)
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(8)).current;

    // Dots animation
    const dot1 = useRef(new Animated.Value(0.35)).current;
    const dot2 = useRef(new Animated.Value(0.35)).current;
    const dot3 = useRef(new Animated.Value(0.35)).current;

    const dots = React.useMemo(() => [dot1, dot2, dot3], [dot1, dot2, dot3]);

    useEffect(() => {
        // Subtle entrance
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 420,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 420,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();

        // Dots loop
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(dot1, { toValue: 1, duration: 260, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 1, duration: 260, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 1, duration: 260, useNativeDriver: true }),
                Animated.timing(dot1, { toValue: 0.35, duration: 240, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 0.35, duration: 240, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 0.35, duration: 240, useNativeDriver: true }),
            ])
        );
        loop.start();

        return () => loop.stop();
    }, [opacity, translateY, dot1, dot2, dot3]);

    return (
        <AppSafeScreen scroll style={styles.safe} contentContainerStyle={styles.scrollContent}>
            <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
                {/* Illustration */}
                <View style={styles.illustrationWrap}>
                    <Image
                        source={require("../../../assets/branding/zenvy-logo.png")}
                        style={styles.illustration}
                        resizeMode="contain"
                        accessibilityLabel="Welcome Illustration"
                    />
                </View>

                {/* Title + Subtitle */}
                <View style={styles.textBlock}>
                    <Text style={styles.title}>Get Anything{"\n"}Delivered</Text>
                    <Text style={styles.subtitle}>
                        From restaurants to groceries,{"\n"}right to your door
                    </Text>
                </View>

                {/* Buttons */}
                <View style={styles.actions}>
                    <PrimaryButton
                        title="Sign Up"
                        onPress={() => navigation.navigate("Register")}
                        style={styles.btn}
                        textStyle={styles.btnText}
                    />

                    <OutlineButton
                        title="Login"
                        onPress={() => navigation.navigate("Login")}
                        style={styles.btn}
                        textStyle={styles.outlineBtnText}
                    />
                </View>

                {/* Dots */}
                <View style={styles.dotsRow} pointerEvents="none">
                    <Animated.View style={[styles.dot, { opacity: dots[0], backgroundColor: colors.primary }]} />
                    <Animated.View style={[styles.dot, { opacity: dots[1], backgroundColor: colors.primary }]} />
                    <Animated.View style={[styles.dot, { opacity: dots[2], backgroundColor: colors.primary }]} />
                </View>
            </Animated.View>
        </AppSafeScreen>
    );
}

const TITLE = "#0F172A"; // near-black like the reference
const SUB = "#94A3B8"; // soft gray

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.white },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 22,
        paddingTop: 8,
        paddingBottom: 18,
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: "space-between",
    },

    illustrationWrap: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0, // Reduced from 8
    },
    illustration: {
        width: "100%",
        height: 360,
    },

    textBlock: {
        alignItems: "center",
        marginTop: -40, // Pull text closer to logo (adjust as needed for logo whitespace)
    },
    title: {
        textAlign: "center",
        fontSize: 44,
        lineHeight: 50,
        fontWeight: "800",
        color: TITLE,
        letterSpacing: 0.2,
    },
    subtitle: {
        marginTop: 16,
        textAlign: "center",
        fontSize: 18,
        lineHeight: 26,
        fontWeight: "500",
        color: SUB,
    },

    actions: {
        marginTop: 26,
        gap: 14,
    },

    btn: {
        height: 64, // Keep height consistent
    },

    btnText: {
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    outlineBtnText: {
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 0.2,
        color: colors.primary, // Ensure outline text color matches primary
    },

    dotsRow: {
        marginTop: 18,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 999,
    },
});
