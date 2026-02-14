import React, { useMemo, useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { AppIcon } from "../../shared/ui/AppIcon";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";

// ✅ Adjust ONLY if your store path is different
import { useAuthStore } from "../store/auth.store";

import { colors } from "../../shared/theme/colors";
import { spacing } from "../../shared/theme/spacing";
import { radius } from "../../shared/theme/radius";

export default function LoginScreen({ navigation }: any) {
    const login = useAuthStore((s: any) => s.login);
    const isLoading = useAuthStore((s: any) => s.isLoading);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length > 0;
    }, [email, password]);

    async function onSubmit() {
        setError(null);

        if (!canSubmit) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            await login({
                email: email.trim().toLowerCase(),
                password,
            });

            // RootNavigator must react to auth state and route by role.
        } catch (e: any) {
            // Debug: Log full error
            console.log("Login Error Full:", JSON.stringify(e, null, 2));
            const msg = e?.friendlyMessage || e?.message || "Login failed. Please try again.";
            setError(msg === "Network Error" ? "Cannot connect to server. Check your internet." : msg);
        }
    }

    return (
        <AppSafeScreen scroll keyboardAvoiding style={styles.safe}>
            <View style={styles.container}>
                {/* Logo (exact placement: centered above title like your mock) */}
                <Image
                    source={require("../../../assets/branding/zenvy-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Title */}
                <Text style={styles.title}>Welcome Back</Text>

                {/* Email label + input */}
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrap, styles.inputActive]}>
                    <AppIcon
                        name="email-outline"
                        size={24}
                        color={colors.gray500}
                    />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder=""
                        placeholderTextColor={colors.gray400}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Password label + input */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrap}>
                    <AppIcon
                        name="lock-outline"
                        size={24}
                        color={colors.gray500}
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder=""
                        placeholderTextColor={colors.gray400}
                        secureTextEntry={!showPass}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Eye toggle */}
                    <Pressable
                        onPress={() => setShowPass((v) => !v)}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Toggle password visibility"
                    >
                        <AppIcon
                            name={showPass ? "eye-off-outline" : "eye-outline"}
                            size={24}
                            color={colors.gray500}
                        />
                    </Pressable>
                </View>

                {/* Forgot Password link (right aligned under password input) */}
                <Pressable
                    style={styles.forgotWrap}
                    onPress={() => navigation.navigate("ForgotPassword")}
                >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>

                {/* Error */}
                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Login Button (same style system as Sign Up button) */}
                <PrimaryButton
                    title={isLoading ? "Logging in..." : "Login"}
                    onPress={onSubmit}
                    disabled={!canSubmit || isLoading}
                    style={styles.cta}
                    textStyle={styles.ctaText} // Pass text style to override if needed, though PrimaryButton has its own defaults
                />

                {/* Footer */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                    <Pressable onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </AppSafeScreen>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.white,
    },
    container: {
        paddingHorizontal: spacing.l,
        paddingTop: spacing.m,
        paddingBottom: spacing.l,
    },

    logo: {
        alignSelf: "center",
        width: 200,
        height: 120,
        marginTop: spacing.m,
        marginBottom: spacing.m,
    },

    title: {
        textAlign: "center",
        fontSize: 46,
        fontWeight: "900",
        color: colors.gray900,
        marginBottom: spacing.xl ?? 28,
    },

    label: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.gray900,
        marginBottom: spacing.s,
    },

    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.gray300,
        borderRadius: radius.l,
        paddingHorizontal: spacing.m,
        height: 64,
        backgroundColor: colors.white,
        marginBottom: spacing.l,
    },

    // email field is green border highlight like your mock
    inputActive: {
        borderColor: colors.primary,
    },

    input: {
        flex: 1,
        marginLeft: spacing.s,
        fontSize: 18,
        color: colors.gray900,
    },

    forgotWrap: {
        alignSelf: "flex-end",
        marginTop: -spacing.m,
        marginBottom: spacing.l,
    },
    forgotText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "700",
        textDecorationLine: "underline",
    },

    error: {
        color: "#D32F2F",
        fontSize: 14,
        marginTop: -spacing.s,
        marginBottom: spacing.m,
    },

    cta: {
        marginTop: spacing.s,
        // Remove fixed height/borderRadius/bg/shadow as PrimaryButton handles it, or keep if overriding
        // Keeping margin
    },
    ctaText: {
        // PrimaryButton handles text style, but we can override fontSize if needed
        fontSize: 22,
    },

    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.xl ?? 28,
    },
    footerText: {
        color: colors.gray500,
        fontSize: 16,
    },
    footerLink: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "900",
    },
});
