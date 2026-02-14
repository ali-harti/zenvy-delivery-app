import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '../realtime/socket';
import { addNotification } from '../store/slices/notificationsSlice';
import { updateOrderStatus } from '../store/slices/ordersSlice';
import { updateDeliveryStatus } from '../store/slices/deliveriesSlice';

/**
 * Custom hook for Socket.IO real-time notifications
 */
export const useSocket = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { lastNotification } = useSelector((state) => state.notifications);

    useEffect(() => {
        if (isAuthenticated) {
            // Connect to Socket.IO
            socketService.connect();

            // Listen for notifications
            const handleNotification = (notification) => {
                console.log('📨 Received notification:', notification);

                // Add to notifications slice
                dispatch(addNotification(notification));

                // Update order status if order-related
                if (notification.type === 'order_status_changed' && notification.data) {
                    dispatch(updateOrderStatus({
                        orderId: notification.data.orderId,
                        status: notification.data.status
                    }));

                    // Update delivery status for couriers
                    if (user?.role === 'courier') {
                        dispatch(updateDeliveryStatus({
                            orderId: notification.data.orderId,
                            status: notification.data.status
                        }));
                    }
                }
            };

            socketService.onOrderUpdate(handleNotification);

            return () => {
                socketService.offOrderUpdate(handleNotification);
                socketService.disconnect();
            };
        }
    }, [isAuthenticated, user, dispatch]);

    return {
        isConnected: socketService.isConnected(),
        lastNotification
    };
};
