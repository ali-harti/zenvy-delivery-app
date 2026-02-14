import React from 'react';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

export type IconProvider = 'MaterialCommunityIcons' | 'Ionicons' | 'Feather';

export interface AppIconProps {
    name: string;
    provider?: IconProvider;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
    onPress?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
    name,
    provider = 'MaterialCommunityIcons',
    size = 24,
    color = colors.text,
    style,
}) => {
    const IconComponent = provider === 'Ionicons' ? Ionicons :
        provider === 'Feather' ? Feather :
            MaterialCommunityIcons;

    return <IconComponent name={name as any} size={size} color={color} style={style} />;
};
