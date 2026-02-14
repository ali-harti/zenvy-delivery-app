import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLivreur } from '../../context/LivreurContext';
import { colors } from '../../theme/colors';

const HomeHeader: React.FC = () => {
    const { profile, isOnline } = useLivreur();

    if (!profile) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Livreur</Text>
            <View style={styles.profileContainer}>
                <View style={styles.avatarPlaceholder}>
                    <Feather name="user" size={24} color={colors.textSecondary} />
                </View>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.offline }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    profileContainer: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: colors.background,
    },
});

export default HomeHeader;
