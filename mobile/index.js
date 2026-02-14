import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import Root from './src/app/Root';


// Suppress Expo Go Notification Error
const originalError = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('expo-notifications: Android Push notifications')) {
        return;
    }
    originalError(...args);
};

registerRootComponent(Root);

