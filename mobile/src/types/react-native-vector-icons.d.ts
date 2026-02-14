declare module 'react-native-vector-icons/Ionicons' {
    import { IconProps } from 'react-native-vector-icons/Icon';
    import React from 'react';
    class Icon extends React.Component<IconProps> { }
    export default Icon;
    export const getImageSource: (
        name: string,
        size?: number,
        color?: string,
    ) => Promise<any>;
    export const getImageSourceSync: (
        name: string,
        size?: number,
        color?: string,
    ) => any;
}
