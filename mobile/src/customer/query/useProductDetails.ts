import { useMemo } from 'react';
import { useStoreDetails, ProductDTO } from './useStoreQuery';

export const useProductDetails = (storeId: string, productId: string) => {
    const { data: store, isLoading, error } = useStoreDetails(storeId);

    const product = useMemo(() => {
        if (!store?.products) return null;
        return store.products.find((p: ProductDTO) => p.id === productId || String(p.id) === String(productId));
    }, [store, productId]);

    return { product, isLoading, error };
};
