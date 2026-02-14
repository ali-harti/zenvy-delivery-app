import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../store/slices/cartSlice';

/**
 * Custom hook for cart operations
 */
export const useCart = (autoFetch = true) => {
    const dispatch = useDispatch();
    const { items, totalAmount, itemCount, loading, error } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && autoFetch) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, autoFetch, dispatch]);

    const addItem = async (productId, quantity = 1) => {
        return dispatch(addToCart({ productId, quantity })).unwrap();
    };

    const updateItem = async (productId, quantity) => {
        return dispatch(updateCartItem({ productId, quantity })).unwrap();
    };

    const removeItem = async (productId) => {
        return dispatch(removeFromCart(productId)).unwrap();
    };

    const clear = async () => {
        return dispatch(clearCart()).unwrap();
    };

    const refresh = () => {
        dispatch(fetchCart());
    };

    return {
        items,
        totalAmount,
        itemCount,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clear,
        refresh
    };
};
