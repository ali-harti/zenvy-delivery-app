import React from "react";
import {
    View,
    ViewStyle,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleProp,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

interface Props {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    edges?: Edge[];
    scroll?: boolean;
    keyboardAvoiding?: boolean;
    keyboardOffset?: number;
    backgroundColor?: string;
}

export function AppSafeScreen({
    children,
    style,
    contentContainerStyle,
    edges = ["top", "bottom"],
    scroll = false,
    keyboardAvoiding = false,
    keyboardOffset = 0,
    backgroundColor = colors.bg,
}: Props) {
    const Wrapper = scroll ? ScrollView : View;

    // Base container style
    const containerStyle = [
        styles.container,
        { backgroundColor },
        style,
    ];

    const Content = (
        <Wrapper
            style={[{ flex: 1 }]}
            contentContainerStyle={[
                scroll && styles.scrollContent,
                contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </Wrapper>
    );

    return (
        <SafeAreaView style={containerStyle} edges={edges}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={backgroundColor}
            />
            {keyboardAvoiding ? (
                <KeyboardAvoidingView
                    style={styles.keyboard}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={keyboardOffset}
                >
                    {Content}
                </KeyboardAvoidingView>
            ) : (
                Content
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});
