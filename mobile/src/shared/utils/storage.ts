import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@config/constants';

export const storage = {
    async getToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (e) {
            console.error('Failed to get token', e);
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } catch (e) {
            console.error('Failed to set token', e);
        }
    },

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        } catch (e) {
            console.error('Failed to remove token', e);
        }
    },

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(`Failed to get item ${key}`, e);
            return null;
        }
    },

    async setItem(key: string, value: any): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error(`Failed to set item ${key}`, e);
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`Failed to remove item ${key}`, e);
        }
    },
};
