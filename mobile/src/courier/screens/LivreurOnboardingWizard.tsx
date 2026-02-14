import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    StatusBar,
    ScrollView,
    Switch,
    Platform,
    SafeAreaView,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLivreurStore } from '../../stores/livreur.store';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../auth/store/auth.store';

const { width, height } = Dimensions.get('window');
const COLORS = {
    primary: '#00b894',
    text: '#212529',
    subText: '#6c757d',
    bg: '#f8f9fa',
    white: '#ffffff',
    border: '#e9ecef',
    success: '#d1f4e0',
    successText: '#0f5132',
    notificationBg: '#dfe6f5',
    notificationIcon: '#0d6efd',
};

// --- Animations ---
// FadeInUp wrapper
const FadeInView = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {children}
        </Animated.View>
    );
};

export default function LivreurOnboardingWizard() {
    const [step, setStep] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;
    // Store Actions
    const startShift = useLivreurStore((s) => s.startShift);
    const completeShiftGate = useLivreurStore((s) => s.completeShiftGate);
    const setStoreVehicle = useLivreurStore((s) => s.setVehicleType);
    const setStoreOnline = useLivreurStore((s) => s.setOnline);
    const navigation = useNavigation();

    // User Data
    const user = useAuthStore((s) => s.user);
    const driverName = user ? `${user.firstName} ${user.lastName}` : "Livreur";
    const rating = useLivreurStore((s) => s.rating);
    const zoneName = useLivreurStore((s) => s.zoneName);

    // Step 2 State
    const [permissions, setPermissions] = useState({ location: false, notifications: false });

    // Step 3 State
    const [isOnline, setIsOnline] = useState(false);
    const [vehicle, setVehicle] = useState<'bike' | 'scooter' | 'car' | null>('scooter');
    const [isReady, setIsReady] = useState(false);

    // Step 4 State
    // Pulsing animation for map pin
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (step === 3) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [step]);


    const nextStep = () => {
        if (step < 3) {
            Animated.timing(slideAnim, {
                toValue: -(width * (step + 1)),
                duration: 300,
                useNativeDriver: true,
            }).start(() => setStep(step + 1));
        } else {
            // Finish Flow: Sync State & Complete
            setStoreVehicle(vehicle || 'scooter');

            if (isOnline) {
                startShift(); // Sets shiftReady=true, isOnline=true
            } else {
                setStoreOnline(false);
                completeShiftGate(); // Sets shiftReady=true
            }
        }
    };

    const prevStep = () => {
        if (step > 0) {
            Animated.timing(slideAnim, {
                toValue: -(width * (step - 1)),
                duration: 300,
                useNativeDriver: true,
            }).start(() => setStep(step - 1));
        }
    };

    const renderStep1 = () => (
        <View style={styles.slide}>
            <FadeInView delay={100}>
                <Text style={styles.title}>Start your shift</Text>
                <Text style={styles.subtitle}>Confirm your status and go online to receive deliveries.</Text>
            </FadeInView>

            <FadeInView delay={200}>
                <View style={styles.card}>
                    <View style={styles.profileRow}>
                        <View>
                            <View style={[styles.profileImage, { backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' }]}>
                                <Ionicons name="person" size={40} color="#adb5bd" />
                            </View>
                            <View style={styles.onlineDot} />
                        </View>
                        <View style={{ marginLeft: 16 }}>
                            <Text style={styles.profileName}>{driverName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={[styles.profileDetail, { marginLeft: 4 }]}>{rating} Rating</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                <MaterialCommunityIcons name={vehicle === 'bike' ? 'bicycle' : vehicle === 'scooter' ? 'moped' : 'car'} size={14} color={COLORS.subText} />
                                <Text style={[styles.profileDetail, { marginLeft: 4 }]}>
                                    Vehicle: {vehicle ? vehicle.charAt(0).toUpperCase() + vehicle.slice(1) : 'Not Set'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </FadeInView>

            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.slide}>
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <FadeInView delay={100}>
                <Text style={styles.title}>Permissions Check</Text>
                <Text style={styles.subtitle}>To ensure a smooth delivery experience, please allow the following permissions.</Text>
            </FadeInView>

            <View style={{ gap: 16, marginTop: 24 }}>
                <FadeInView delay={200}>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: COLORS.success }]}>
                                <Ionicons name="location" size={24} color={COLORS.primary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.cardTitle}>Location Access</Text>
                                <Text style={styles.cardSub}>Required for navigation and to find nearby orders.</Text>
                            </View>
                        </View>
                        <View style={styles.actionRow}>
                            {permissions.location ? (
                                <View style={styles.badgeSuccess}>
                                    <Text style={styles.badgeText}>✓ Enabled</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.outlineButton}
                                    onPress={() => setPermissions(p => ({ ...p, location: true }))}
                                >
                                    <Text style={styles.outlineButtonText}>Open Settings</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </FadeInView>

                <FadeInView delay={300}>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: COLORS.notificationBg }]}>
                                <Ionicons name="notifications" size={24} color={COLORS.notificationIcon} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.cardTitle}>Notifications</Text>
                                <Text style={styles.cardSub}>Get instant alerts for new delivery requests and updates.</Text>
                            </View>
                        </View>
                        <View style={styles.actionRow}>
                            {permissions.notifications ? (
                                <View style={styles.badgeSuccess}>
                                    <Text style={styles.badgeText}>✓ Enabled</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.outlineButton}
                                    onPress={() => setPermissions(p => ({ ...p, notifications: true }))}
                                >
                                    <Text style={styles.outlineButtonText}>Enable</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </FadeInView>
            </View>

            <View style={{ flex: 1 }} />
            <TouchableOpacity
                style={[styles.primaryButton, (!permissions.location || !permissions.notifications) && styles.disabledButton]}
                onPress={nextStep}
                disabled={!permissions.location || !permissions.notifications}
            >
                <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.slide}>
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <FadeInView delay={100}>
                <Text style={styles.title}>Go Online</Text>
                <Text style={styles.subtitle}>Confirm your status and vehicle to start.</Text>
            </FadeInView>

            <FadeInView delay={200}>
                <View style={[styles.card, { alignItems: 'center', marginTop: 24, paddingVertical: 32 }]}>
                    <View style={styles.toggleRow}>
                        <Text style={[styles.toggleLabel, !isOnline && styles.activeToggleLabel]}>Offline</Text>
                        <Switch
                            trackColor={{ false: "#e9ecef", true: COLORS.primary }}
                            thumbColor={COLORS.white}
                            ios_backgroundColor="#e9ecef"
                            onValueChange={setIsOnline}
                            value={isOnline}
                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginHorizontal: 12 }}
                        />
                        <Text style={[styles.toggleLabel, isOnline && styles.activeToggleLabel, { color: isOnline ? COLORS.primary : COLORS.subText }]}>Online</Text>
                    </View>
                    <Text style={styles.statusText}>
                        {isOnline ? "You are now visible to receive orders." : "You are currently offline."}
                    </Text>
                </View>
            </FadeInView>

            <Text style={styles.sectionHeader}>Select vehicle type</Text>
            <View style={styles.vehicleRow}>
                {['bike', 'scooter', 'car'].map((v) => (
                    <TouchableOpacity
                        key={v}
                        style={[styles.vehicleBtn, vehicle === v && styles.vehicleBtnActive]}
                        onPress={() => setVehicle(v as any)}
                    >
                        <MaterialCommunityIcons
                            name={v === 'bike' ? 'bicycle' : v === 'scooter' ? 'moped' : 'car'}
                            size={32}
                            color={vehicle === v ? 'white' : COLORS.text}
                        />
                        <Text style={[styles.vehicleText, vehicle === v && styles.vehicleTextActive]}>
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FadeInView delay={300}>
                <TouchableOpacity style={styles.checkboxCard} onPress={() => setIsReady(!isReady)}>
                    <View style={[styles.checkbox, isReady && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
                        {isReady && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text style={styles.checkboxText}>Battery & internet ready</Text>
                </TouchableOpacity>
            </FadeInView>

            <View style={{ flex: 1 }} />
            <TouchableOpacity
                style={[styles.primaryButton, (!isOnline || !isReady) && styles.disabledButton]}
                onPress={nextStep}
                disabled={!isOnline || !isReady}
            >
                <Text style={styles.primaryButtonText}>Start Delivering</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.slide}>
            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <FadeInView delay={100}>
                <Text style={styles.title}>Confirm your zone</Text>
                <Text style={styles.subtitle}>Ensure you are in the correct area to receive orders.</Text>
            </FadeInView>

            <FadeInView delay={200}>
                <View style={[styles.card, { padding: 0, overflow: 'hidden', marginTop: 24 }]}>
                    <View style={styles.zoneHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.success, width: 44, height: 44 }]}>
                            <Ionicons name="location" size={24} color={COLORS.primary} />
                        </View>
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.cardTitle}>Casablanca</Text>
                            <View style={styles.badgeSuccess}>
                                <Text style={[styles.badgeText, { fontSize: 10 }]}>Detected</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Simulated Map */}
                    <View style={styles.mapContainer}>
                        {/* Grid Lines */}
                        <View style={[styles.gridLine, { top: 40 }]} />
                        <View style={[styles.gridLine, { top: 80 }]} />
                        <View style={[styles.gridLine, { top: 120 }]} />
                        <View style={[styles.gridLine, { top: 160 }]} />
                        <View style={[styles.gridLineVertical, { left: 50 }]} />
                        <View style={[styles.gridLineVertical, { left: 100 }]} />
                        <View style={[styles.gridLineVertical, { left: 150 }]} />
                        <View style={[styles.gridLineVertical, { left: 200 }]} />
                        <View style={[styles.gridLineVertical, { left: 250 }]} />

                        {/* Pulse Circle */}
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
                        {/* Center Pin */}
                        <View style={styles.mapPin}>
                            <Ionicons name="location" size={24} color={COLORS.white} />
                        </View>
                    </View>
                </View>
            </FadeInView>

            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
                <Text style={styles.primaryButtonText}>Confirm Zone</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.slider,
                        {
                            width: width * 4,
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}
                >
                    {renderStep1()}
                    {renderStep2()}
                    {renderStep3()}
                    {renderStep4()}
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    slider: {
        flex: 1,
        flexDirection: 'row',
    },
    slide: {
        width: width,
        flex: 1, // Ensures step takes full height
        padding: 20,
        backgroundColor: COLORS.bg,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.subText,
        marginBottom: 20,
        lineHeight: 22,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    // Step 1 Styles
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: 'white',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    profileDetail: {
        fontSize: 14,
        color: COLORS.subText,
        marginBottom: 2,
    },

    // Buttons
    primaryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
    backButton: {
        paddingVertical: 10,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        fontSize: 16,
        color: COLORS.text,
    },

    // Step 2 Styles
    row: { flexDirection: 'row', alignItems: 'flex-start' },
    iconCircle: {
        width: 48, height: 48, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
    cardSub: { fontSize: 14, color: COLORS.subText, lineHeight: 20 },
    actionRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
    badgeSuccess: {
        backgroundColor: COLORS.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    badgeText: { color: COLORS.successText, fontWeight: 'bold', fontSize: 13 },
    outlineButton: {
        borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8,
    },
    outlineButtonText: { color: COLORS.primary, fontWeight: '600' },

    // Step 3 Styles
    toggleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    toggleLabel: { fontSize: 16, color: COLORS.subText, fontWeight: '500' },
    activeToggleLabel: { color: COLORS.text, fontWeight: 'bold' },
    statusText: { fontSize: 14, color: COLORS.subText },

    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 32, marginBottom: 16, color: COLORS.text },
    vehicleRow: { flexDirection: 'row', gap: 12 },
    vehicleBtn: {
        flex: 1, backgroundColor: 'white', borderWidth: 2, borderColor: COLORS.border,
        borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center',
    },
    vehicleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    vehicleText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: COLORS.text },
    vehicleTextActive: { color: 'white' },

    checkboxCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
        borderRadius: 16, padding: 16, marginTop: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 2,
    },
    checkbox: {
        width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: COLORS.border,
        marginRight: 12, alignItems: 'center', justifyContent: 'center',
    },
    checkboxText: { fontSize: 16, fontWeight: '500', color: COLORS.text },

    // Step 4 Map Simulation
    zoneHeader: {
        padding: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    mapContainer: {
        height: 200, backgroundColor: '#f0f2f5', position: 'relative', overflow: 'hidden',
    },
    gridLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#e9ecef' },
    gridLineVertical: { position: 'absolute', width: 1, height: '100%', backgroundColor: '#e9ecef' },
    pulseCircle: {
        position: 'absolute', top: 75, left: 125, width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(0, 184, 148, 0.2)', borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed',
    },
    mapPin: {
        position: 'absolute', top: 100, left: 150, width: 50, height: 50, borderRadius: 25,
        backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 5, elevation: 5,
    },
});
