import React, { useMemo, useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert, // Import Alert for error handling
} from "react-native";
import { AppSafeScreen } from "../../shared/components/AppSafeScreen";
import { AppIcon } from "../../shared/ui/AppIcon";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { RoleCard } from "../components/RoleCard";

import { useAuthStore } from "../store/auth.store";
import { colors } from "../../shared/theme/colors";
import { radius } from "../../shared/theme/radius";
import { spacing } from "../../shared/theme/spacing";

type Role = "customer" | "courier" | "merchant";

export default function RegisterScreen({ navigation }: any) {
    const register = useAuthStore((s: any) => s.register);
    const isLoading = useAuthStore((s: any) => s.isLoading);

    const [role, setRole] = useState<Role>("customer");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Merchant extra fields
    const [storeName, setStoreName] = useState("");
    const [storeAddress, setStoreAddress] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => {
        if (!fullName.trim() || fullName.trim().length < 2) return false;
        if (!email.trim() || !email.includes("@")) return false;
        // Phone must be at least 6 chars and numeric-ish
        const phoneClean = phone.trim().replace(/[^0-9+]/g, '');
        if (phoneClean.length < 6) return false;
        if (!password || password.length < 6) return false;
        if (password !== confirmPassword) return false;

        // Merchant validation
        if (role === "merchant") {
            if (!storeName.trim() || storeName.trim().length < 2) return false;
            if (!storeAddress.trim() || storeAddress.trim().length < 5) return false;
        }

        return true;
    }, [fullName, email, phone, password, confirmPassword, role, storeName, storeAddress]);

    async function onSubmit() {
        setError(null);

        if (!canSubmit) {
            setError("Please fill all fields correctly.");
            return;
        }

        try {
            // Logic from previous implementation: Split Name
            const [firstName, ...lastNameParts] = fullName.trim().split(' ');
            const lastName = lastNameParts.join(' ') || '';

            // Sanitize phone (remove spaces, dashes, etc)
            const sanitizedPhone = phone.trim().replace(/[^0-9+]/g, '');

            console.log("Registering with payload:", {
                firstName,
                lastName,
                email: email.trim().toLowerCase(),
                phone: sanitizedPhone,
                role,
            });

            await register({
                firstName,
                lastName,
                email: email.trim().toLowerCase(),
                phone: sanitizedPhone,
                password,
                role,
                // Merchant extras
                ...(role === "merchant" ? { storeName, storeAddress, storePhone: sanitizedPhone } : {}),
            });

            // Navigate to Login on success
            Alert.alert("Success", "Account created successfully! Please login.");
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        } catch (e: any) {
            console.error("Registration Error details:", e);

            // Extract validation errors if available
            let displayMsg = e?.message || "Registration failed.";

            if (e?.validationErrors && Array.isArray(e.validationErrors) && e.validationErrors.length > 0) {
                // Join all validation messages
                displayMsg = e.validationErrors.map((err: any) => err.message).join("\n");
            } else if (e?.response?.data?.message) {
                displayMsg = e.response.data.message;
            } else if (e?.friendlyMessage) {
                displayMsg = e.friendlyMessage;
            }

            setError(displayMsg);
            Alert.alert("Registration Failed", displayMsg);
        }
    }

    return (
        <AppSafeScreen scroll keyboardAvoiding style={styles.safe}>
            <View style={styles.container}>
                {/* Logo */}
                <Image
                    source={require("../../../assets/branding/zenvy-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Title */}
                <Text style={styles.title}>Create Account</Text>

                {/* Role Cards */}
                <View style={styles.roleRow}>
                    <RoleCard role="customer" selected={role === "customer"} onPress={() => setRole("customer")} />
                    <View style={{ width: spacing.s }} />
                    <RoleCard role="courier" selected={role === "courier"} onPress={() => setRole("courier")} />
                    <View style={{ width: spacing.s }} />
                    <RoleCard role="merchant" selected={role === "merchant"} onPress={() => setRole("merchant")} />
                </View>

                {/* Inputs */}
                <InputRow
                    icon="account-outline"
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                    autoComplete="name"
                    textContentType="name"
                />

                <InputRow
                    icon="email-outline"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                />

                <InputRow
                    icon="phone-outline"
                    placeholder="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                />

                {/* Merchant Extra Inputs */}
                {role === "merchant" && (
                    <View style={{ marginBottom: spacing.m }}>
                        <InputRow
                            icon="store"
                            placeholder="Store Name"
                            value={storeName}
                            onChangeText={setStoreName}
                        />
                        <InputRow
                            icon="map-marker-outline"
                            placeholder="Store Address"
                            value={storeAddress}
                            onChangeText={setStoreAddress}
                        />
                    </View>
                )}

                <InputRow
                    icon="lock-outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
                    onRightIconPress={() => setShowPass((v) => !v)}
                />

                <InputRow
                    icon="lock-check-outline"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    rightIcon={showConfirm ? "eye-off-outline" : "eye-outline"}
                    onRightIconPress={() => setShowConfirm((v) => !v)}
                />

                {error ? (
                    <View style={styles.errorContainer}>
                        <AppIcon name="alert-circle-outline" size={20} color="#D32F2F" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* CTA */}
                <PrimaryButton
                    title={isLoading ? "Creating..." : "Create Account"}
                    onPress={onSubmit}
                    disabled={!canSubmit || isLoading}
                    style={styles.cta}
                    textStyle={styles.ctaText} // Pass text style if you want to override default
                />

                {/* Footer */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Pressable onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.footerLink}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </AppSafeScreen>
    );
}

function InputRow(props: {
    icon: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: any;
    autoCapitalize?: any;
    rightIcon?: string;
    onRightIconPress?: () => void;
    autoComplete?: any;
    textContentType?: any;
}) {
    const {
        icon,
        placeholder,
        value,
        onChangeText,
        secureTextEntry,
        keyboardType,
        autoCapitalize,
        rightIcon,
        onRightIconPress,
    } = props;

    return (
        <View style={styles.inputWrap}>
            <AppIcon name={icon} size={24} color={colors.mutedText} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedText}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoComplete={props.autoComplete}
                textContentType={props.textContentType}
            />
            {rightIcon ? (
                <Pressable onPress={onRightIconPress} hitSlop={12}>
                    <AppIcon name={rightIcon} size={22} color={colors.mutedText} />
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.white,
    },
    container: {
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.l,
        paddingTop: spacing.s,
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
        fontSize: 32,
        fontWeight: "800",
        color: colors.text,
        marginBottom: spacing.l,
    },
    roleRow: {
        flexDirection: "row",
        marginBottom: spacing.l,
        justifyContent: 'space-between', // Try to space them evenly
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.l,
        paddingHorizontal: spacing.m,
        height: 60,
        marginBottom: spacing.m,
        backgroundColor: colors.white,
    },
    input: {
        flex: 1,
        marginLeft: spacing.s,
        fontSize: 16,
        color: colors.text,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: spacing.s,
        borderRadius: radius.m,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: '#FFCDD2',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        flex: 1, // Allow text to wrap if long
        textAlign: 'left',
    },
    cta: {
        marginTop: spacing.m,
        // Height, borderRadius, bg, etc handled by PrimaryButton
    },
    ctaDisabled: {
        opacity: 0.6,
        backgroundColor: colors.mutedText,
    },
    ctaPressed: {
        transform: [{ scale: 0.98 }],
    },
    ctaText: {
        // AppButton has defaults, but we can override font weights etc
        fontSize: 20,
        fontWeight: "800",
    },
    footerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    footerText: {
        color: colors.mutedText,
        fontSize: 16,
    },
    footerLink: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "800",
    },
});
