import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';
import { cardStyles } from './OnlineToggleCard';

const { width } = Dimensions.get('window');

const MainContent: React.FC = () => {
    const { isOnline } = useLivreur();

    if (isOnline) {
        // Show the "Waiting for requests" view
        return (
            <View style={[cardStyles.card, styles.container]}>
                {/* Replace with your actual map image or a Lottie animation */}
                <Image
                    source={{ uri: 'https://via.placeholder.com/600x400/E5E7EB/A0AEC0?text=Map+Radar+Animation' }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Waiting for requests...</Text>
                <Text style={styles.subtitle}>Stay in high-demand areas for more orders.</Text>
            </View>
        );
    } else {
        // Show the "Offline" view
        return (
            <View style={[cardStyles.card, styles.container]}>
                {/* Replace with your actual scooter illustration */}
                <Image
                    source={{ uri: 'https://via.placeholder.com/600x400/E5E7EB/A0AEC0?text=Sleeping+Scooter+Illustration' }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>You're offline.</Text>
                <Text style={styles.subtitle}>Go online to start receiving orders.</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    image: {
        width: width * 0.6,
        height: width * 0.4,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default MainContent;
