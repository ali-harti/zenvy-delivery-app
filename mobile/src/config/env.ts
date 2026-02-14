// src/config/env.ts
import Constants from 'expo-constants';

// Validation helper
const getEnvVar = (key: string): string => {
    const value = process.env[key] || (Constants.expoConfig?.extra?.[key] as string);

    if (!value) {
        // In strict production, we might want to throw. 
        // For dev, we can fallback or warn.
        console.warn(`Missing env var: ${key}`);
        return '';
    }
    return value;
};

// We use process.env for EXPO_PUBLIC_ vars which are inlined at build time
export const ENV = {
    // For Physical Device & Emulator (Universal LAN IP)
    API_URL: 'http://192.168.11.106:5012/api/v1',
    SOCKET_URL: 'http://192.168.11.106:5012',
    ENV: (process.env.EXPO_PUBLIC_ENV || 'development') as 'development' | 'staging' | 'production',
};

// Runtime check (optional but good for debugging)
if (ENV.API_URL.includes('localhost') && ENV.ENV === 'production') {
    console.warn('WARNING: Running in PRODUCTION mode with localhost API URL');
}
