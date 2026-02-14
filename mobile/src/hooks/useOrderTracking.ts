import { useState, useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../types/order';
import { useNotificationsStore } from "../state/notifications/notifications.store";

// Simulated Driver Data
const MOCK_DRIVER = {
    id: 'd1',
    name: 'Karim Benali',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    phone: '+212600000000',
};

// Casablanca Coord for simulation
const START_LOC = { latitude: 33.5898, longitude: -7.6038 };
const END_LOC = { latitude: 33.5731, longitude: -7.5898 };

export const useOrderTracking = (order: Order | undefined) => {
    const [driverLocation, setDriverLocation] = useState(START_LOC);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(order?.status || 'PREPARING');
    const [driver, setDriver] = useState(order?.driver || MOCK_DRIVER);
    const [progress, setProgress] = useState(0); // 0 to 1

    useEffect(() => {
        if (!order) return;
        setOrderStatus(order.status);
    }, [order]);

    // Simulate Driver Movement & Status Progression
    useEffect(() => {
        // Only simulate if active
        if (orderStatus === 'DELIVERED' || orderStatus === 'CANCELLED') return;

        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 0.05; // Move 5% every step

                // Interpolate location
                const lat = START_LOC.latitude + (END_LOC.latitude - START_LOC.latitude) * next;
                const lng = START_LOC.longitude + (END_LOC.longitude - START_LOC.longitude) * next;
                setDriverLocation({ latitude: lat, longitude: lng });

                // Simulate status change based on progress
                if (next > 0.2 && orderStatus === 'PREPARING') {
                    setOrderStatus('PICKED_UP');
                    if (order) {
                        useNotificationsStore.getState().addNotification({
                            id: `not_trk_pkd_${Date.now()}`,
                            type: 'ORDER',
                            title: 'Order Picked Up',
                            message: `Your driver ${driver.name} has picked up your order.`,
                            timeLabel: 'Just now',
                            createdAtISO: new Date().toISOString(),
                            meta: { orderId: order.id },
                        });
                    }
                }

                if (next > 0.5 && orderStatus === 'PICKED_UP') {
                    setOrderStatus('ON_THE_WAY');
                    if (order) {
                        useNotificationsStore.getState().addNotification({
                            id: `not_trk_otw_${Date.now()}`,
                            type: 'ORDER',
                            title: 'Order On The Way',
                            message: `Your order is on the way to your location.`,
                            timeLabel: 'Just now',
                            createdAtISO: new Date().toISOString(),
                            meta: { orderId: order.id },
                        });
                    }
                }

                if (next >= 1.0) {
                    setOrderStatus('DELIVERED');
                    if (order) {
                        useNotificationsStore.getState().addNotification({
                            id: `not_trk_del_${Date.now()}`,
                            type: 'ORDER',
                            title: 'Order Delivered',
                            message: 'Your order has been delivered. Enjoy your meal!',
                            timeLabel: 'Just now',
                            createdAtISO: new Date().toISOString(),
                            meta: { orderId: order.id },
                        });
                    }
                }

                return next >= 1 ? 1 : next;
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, [orderStatus, order]); // Added order to dependency

    return {
        driver,
        driverLocation,
        orderStatus,
        isSimulated: true
    };
};
