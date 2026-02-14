import React from 'react';
import { AppButton } from './AppButton';
import { ViewStyle, TextStyle } from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => {
    return <AppButton {...props} variant="primary" />;
};
