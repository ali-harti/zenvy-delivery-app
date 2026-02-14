import React from 'react';
import { TextProps } from 'react-native';
import { AppText } from '../components/AppText';
import { colors } from '../theme';

interface TypographyProps extends TextProps {
    variant?: "title" | "h1" | "h2" | "h3" | "body" | "small" | "caption" | "tiny" | "bodyBold";
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color = colors.text,
    align = 'left',
    style,
    ...props
}) => {
    // Map variants
    let mapVariant = variant;
    let extraStyle: any = {};

    if (variant === 'caption') mapVariant = 'small';
    if (variant === 'h3') mapVariant = 'h2';
    if (variant === 'bodyBold') {
        mapVariant = 'body';
        extraStyle = { fontWeight: 'bold' };
    }


    return (
        <AppText
            variant={mapVariant as any}
            style={[{ color, textAlign: align }, extraStyle, style]}
            {...props}
        >
            {children}
        </AppText>
    );
};
