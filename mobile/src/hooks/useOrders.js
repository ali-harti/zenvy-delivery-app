import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
    createOrder,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    setActiveOrder,
    clearCurrentOrder
} from '../store/slices/ordersSlice';

/**
 * Custom hook for orders
 */
export const useOrders = (autoFetch = false) => {
    const dispatch = useDispatch();
    const { orders, currentOrder, activeOrder, loading, creating, error, count } = useSelector(
        (state) => state.orders
    );
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && autoFetch) {
            dispatch(fetchOrders());
        }
    }, [isAuthenticated, autoFetch, dispatch]);

    const placeOrder = async (orderData) => {
        return dispatch(createOrder(orderData)).unwrap();
    };

    const getOrders = async (params) => {
        return dispatch(fetchOrders(params)).unwrap();
    };

    const getOrderById = async (orderId) => {
        return dispatch(fetchOrderById(orderId)).unwrap();
    };

    const cancel = async (orderId, reason) => {
        return dispatch(cancelOrder({ orderId, reason })).unwrap();
    };

    const trackOrder = (order) => {
        dispatch(setActiveOrder(order));
    };

    const clearCurrent = () => {
        dispatch(clearCurrentOrder());
    };

    return {
        orders,
        currentOrder,
        activeOrder,
        loading,
        creating,
        error,
        count,
        placeOrder,
        getOrders,
        getOrderById,
        cancel,
        trackOrder,
        clearCurrent
    };
};
