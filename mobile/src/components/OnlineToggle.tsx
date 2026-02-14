import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text } from 'react-native-paper';

interface OnlineToggleProps {
    value: boolean;
    onChange: (val: boolean) => void;
}

export function OnlineToggle({ value, onChange }: OnlineToggleProps) {
    return (
        <View style={styles.container}>
            <Text
                variant="titleMedium"
                style={[styles.label, !value && styles.activeLabel]}
            >
                Offline
            </Text>

            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#e9ecef', true: '#00b894' }}
                thumbColor={'white'}
                ios_backgroundColor="#e9ecef"
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginHorizontal: 12 }}
            />

            <Text
                variant="titleMedium"
                style={[styles.label, value && { color: '#00b894', fontWeight: 'bold' }]}
            >
                Online
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    label: {
        color: '#adb5bd',
        fontWeight: '500',
    },
    activeLabel: {
        color: '#212529',
        fontWeight: 'bold',
    },
});
