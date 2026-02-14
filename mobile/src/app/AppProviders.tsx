import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from '@theme/colors';
import { CartProvider } from '../state/cart/CartContext';
import { OrdersProvider } from '../state/orders/OrdersContext';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
        },
    },
});

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <OrdersProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </OrdersProvider>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}
