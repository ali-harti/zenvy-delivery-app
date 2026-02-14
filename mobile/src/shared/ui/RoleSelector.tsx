import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRole } from '@api/types/dto';
import { colors, radius, spacing } from '../theme';
import { Typography } from './Typography';

interface RoleSelectorProps {
    selectedRole: UserRole;
    onSelect: (role: UserRole) => void;
}

export const RoleSelector = ({ selectedRole, onSelect }: RoleSelectorProps) => {
    return (
        <View style={styles.container}>
            <RoleCard
                role={UserRole.CUSTOMER}
                isSelected={selectedRole === UserRole.CUSTOMER}
                onPress={() => onSelect(UserRole.CUSTOMER)}
                label="Customer"
                icon="🛍️"
            />
            <View style={{ width: 16 }} />
            <RoleCard
                role={UserRole.COURIER}
                isSelected={selectedRole === UserRole.COURIER}
                onPress={() => onSelect(UserRole.COURIER)}
                label="Courier"
                icon="🚚"
            />
        </View>
    );
};

const RoleCard = ({ role, isSelected, onPress, label, icon }: any) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[
                styles.card,
                isSelected && styles.cardSelected
            ]}
        >
            <Typography variant="h1" style={{ marginBottom: 8 }}>{icon}</Typography>
            <Typography
                variant="body"
                style={{
                    fontWeight: '600',
                    color: isSelected ? colors.primary : colors.textSecondary
                }}
            >
                {label}
            </Typography>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    card: {
        flex: 1,
        height: 120,
        backgroundColor: colors.cardBg,
        borderRadius: radius.l,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.greenSoft,
        borderWidth: 2,
    }
});
