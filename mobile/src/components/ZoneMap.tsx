import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';

interface ZoneMapProps {
    latitude: number;
    longitude: number;
    radius: number;
}

export function ZoneMap({ latitude, longitude, radius }: ZoneMapProps) {
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const animatedStyle = {
        transform: [{ scale: pulseAnim }],
        opacity: pulseAnim.interpolate({
            inputRange: [1, 1.5],
            outputRange: [0.4, 0.1],
        }),
    };

    return (
        <View style={styles.container}>
            {/* Simulated Grid */}
            <View style={styles.grid}>
                {[1, 2, 3, 4].map((i) => (
                    <View key={`h-${i}`} style={[styles.line, { top: i * 40 }]} />
                ))}
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={`v-${i}`} style={[styles.lineVertical, { left: i * 50 }]} />
                ))}
            </View>

            {/* Pulse */}
            <Animated.View style={[styles.pulse, animatedStyle]} />

            {/* Pin */}
            <View style={styles.pin}>
                <MaterialCommunityIcons name="map-marker" size={32} color="#00b894" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    grid: {
        ...StyleSheet.absoluteFillObject,
    },
    line: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: '#e9ecef',
    },
    lineVertical: {
        position: 'absolute',
        width: 1,
        height: '100%',
        backgroundColor: '#e9ecef',
    },
    pulse: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 100,
        height: 100,
        marginLeft: -50,
        marginTop: -50,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 184, 148, 0.2)',
        borderWidth: 1,
        borderColor: '#00b894',
        borderStyle: 'dashed',
    },
    pin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
});
