import React from 'react';
import { AppButton } from './AppButton';
import { ViewStyle, TextStyle } from 'react-native';

interface OutlineButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const OutlineButton: React.FC<OutlineButtonProps> = (props) => {
    return <AppButton {...props} variant="secondary" />;
};
