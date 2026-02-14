import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';

interface AppHeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export const AppHeader = ({ title, showBack = false, rightAction }: AppHeaderProps) => {
    const navigation = useNavigation();

    return (
        <Appbar.Header style={{ backgroundColor: COLORS.white }} elevated={true}>
            {showBack && <Appbar.BackAction onPress={navigation.goBack} />}
            <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold', fontSize: 18 }} />
            {rightAction}
        </Appbar.Header>
    );
};
