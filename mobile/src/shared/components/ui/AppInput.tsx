import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

interface AppInputProps extends React.ComponentProps<typeof TextInput> {
    errorMessage?: string;
    description?: string;
}

export const AppInput = ({ errorMessage, description, style, ...props }: AppInputProps) => {
    return (
        <View style={styles.container}>
            <TextInput
                mode="outlined"
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                style={[styles.input, style]}
                error={!!errorMessage}
                theme={{ roundness: 8 }}
                {...props}
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            {description && !errorMessage && <Text style={styles.descriptionText}>{description}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: COLORS.background,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
        marginTop: 4,
        marginLeft: 4,
    },
    descriptionText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
        marginLeft: 4,
    },
});
