import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    SafeAreaView,
    Dimensions,
    Platform,
} from 'react-native';
import { useAuthStore } from "../store/auth.store";

// --- Constants matching the visual design ---
const COLORS = {
    background: '#FFFFFF',
    textDark: '#1D1F22', // Deep Charcoal for the main title
    textGrey: '#6B7280', // Muted grey for tagline
    primary: '#16B37A',  // The Zenvy teal/green color
};

const { width } = Dimensions.get('window');

type Props = {
    navigation: any;
};

const SplashScreen = ({ navigation }: Props) => {
    // Navigation Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const isAuthed = useAuthStore.getState().isAuthenticated;
            const isHydrated = useAuthStore.getState().isHydrated;

            if (isHydrated && isAuthed) {
                // User is logged in, no need to navigate to Welcome
                return;
            }

            navigation.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
            });
        }, 2500); // 2.5s delay for splash screen

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.mainContainer}>
            {/* Ensure Status Bar has dark icons on white background */}
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentContainer}>
                    {/* Center Section: Logo & Text */}
                    <View style={styles.centerContent}>
                        <Image
                            source={require('../../../assets/icon.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.titleText}>ZENVY</Text>
                        <Text style={styles.taglineText}>Order Smart. Live Easy.</Text>
                    </View>

                    {/* Bottom Section: Pagination Dots */}
                    <View style={styles.bottomFooter}>
                        {/* We render 3 static dots as shown in the image */}
                        <View style={styles.paginationDot} />
                        <View style={styles.paginationDot} />
                        <View style={styles.paginationDot} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    // Outer container fills screen with white
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    // Safe area manages notches, but sits inside the white container
    safeArea: {
        flex: 1,
    },
    // Holds all content within the safe area
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between', // Pushes footer to bottom
        alignItems: 'center',
    },
    // The centered logo and text block
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logoImage: {
        width: width * 0.25, // Approx 1/4 screen width
        height: width * 0.25,
        marginBottom: 16,
    },
    titleText: {
        fontSize: 34,
        fontWeight: '800', // Extra Bold
        color: COLORS.textDark,
        letterSpacing: 0.5,
        marginBottom: 8,
        // Using system font stack, expecting San Francisco (iOS) or Roboto (Android)
    },
    taglineText: {
        fontSize: 17,
        fontWeight: '500', // Medium weight
        color: COLORS.textGrey,
    },
    // Bottom area for dots
    bottomFooter: {
        height: 100, // Fixed height area at bottom
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 6, // Spacing between dots
    },
});

export default SplashScreen;
