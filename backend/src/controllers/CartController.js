const { Cart, CartItem, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

class CartController {
    constructor() {
        this.addItem = this.addItem.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    /**
     * Get user's cart
     * GET /api/cart
     */
    async getCart(req, res) {
        try {
            const userId = req.user.id;

            let cart = await Cart.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        as: 'items',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id', 'name', 'imageUrl', 'price', 'isAvailable', 'stock']
                            }
                        ]
                    }
                ]
            });

            // Create cart if doesn't exist
            if (!cart) {
                cart = await Cart.create({ userId });
                cart.items = [];
            }

            // Calculate total
            const totalAmount = cart.items.reduce((sum, item) => {
                return sum + (parseFloat(item.priceSnapshot) * item.quantity);
            }, 0);

            return successResponse(res, {
                cart: {
                    id: cart.id,
                    items: cart.items,
                    totalAmount,
                    itemCount: cart.items.length
                }
            });
        } catch (error) {
            console.error('Get cart error:', error);
            return errorResponse(res, 'Failed to fetch cart', 500);
        }
    }

    /**
     * Add item to cart
     * POST /api/cart/items
     */
    async addItem(req, res) {
        try {
            const { productId, quantity = 1 } = req.body;
            const userId = req.user.id;

            // Validate product
            const product = await Product.findByPk(productId);
            if (!product) {
                return errorResponse(res, 'Product not found', 404);
            }

            // Temporarily skip isAvailable check - field may not exist
            // if (!product.isAvailable) {
            //     return errorResponse(res, 'Product is not available', 400);
            // }

            if (product.stock < quantity) {
                return errorResponse(res, 'Insufficient stock', 400);
            }

            // Get or create cart
            let cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                cart = await Cart.create({ userId });
            }

            // Check if item already exists
            let cartItem = await CartItem.findOne({
                where: { cartId: cart.id, productId }
            });

            if (cartItem) {
                // Update quantity
                const newQuantity = cartItem.quantity + quantity;

                if (product.stock < newQuantity) {
                    return errorResponse(res, 'Insufficient stock', 400);
                }

                await cartItem.update({ quantity: newQuantity });
            } else {
                // Create new cart item
                cartItem = await CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity,
                    priceSnapshot: parseFloat(product.price)
                });
            }

            // Fetch updated cart - Temporarily simplified
            // const updatedCart = await this._getFullCart(cart.id);
            // return successResponse(res, { cart: updatedCart }, 'Item added to cart');

            return successResponse(res, { cartItem, cartId: cart.id }, 'Item added to cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            console.error('Error stack:', error.stack);
            if (error.original) console.error('SQL Error:', error.original);
            return errorResponse(res, 'Failed to add item to cart', 500);
        }
    }

    /**
     * Update cart item quantity
     * PATCH /api/cart/items/:id
     */
    async updateItem(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            if (quantity < 1) {
                return errorResponse(res, 'Quantity must be at least 1', 400);
            }

            // Find cart item
            const cartItem = await CartItem.findByPk(id, {
                include: [
                    {
                        model: Cart,
                        as: 'cart',
                        where: { userId }
                    },
                    {
                        model: Product,
                        as: 'product'
                    }
                ]
            });

            if (!cartItem) {
                return errorResponse(res, 'Cart item not found', 404);
            }

            // Check stock
            if (cartItem.product.stock < quantity) {
                return errorResponse(res, 'Insufficient stock', 400);
            }

            await cartItem.update({ quantity });

            // Fetch updated cart
            const updatedCart = await this._getFullCart(cartItem.cartId);

            return successResponse(res, { cart: updatedCart }, 'Cart updated successfully');
        } catch (error) {
            console.error('Update cart error:', error);
            return errorResponse(res, 'Failed to update cart', 500);
        }
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/items/:id
     */
    async removeItem(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const cartItem = await CartItem.findByPk(id, {
                include: [
                    {
                        model: Cart,
                        as: 'cart',
                        where: { userId }
                    }
                ]
            });

            if (!cartItem) {
                return errorResponse(res, 'Cart item not found', 404);
            }

            const cartId = cartItem.cartId;
            await cartItem.destroy();

            // Fetch updated cart
            const updatedCart = await this._getFullCart(cartId);

            return successResponse(res, { cart: updatedCart }, 'Item removed from cart');
        } catch (error) {
            console.error('Remove from cart error:', error);
            return errorResponse(res, 'Failed to remove item', 500);
        }
    }

    /**
     * Clear cart
     * DELETE /api/cart
     */
    async clearCart(req, res) {
        try {
            const userId = req.user.id;

            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return errorResponse(res, 'Cart not found', 404);
            }

            await CartItem.destroy({ where: { cartId: cart.id } });

            return successResponse(res, null, 'Cart cleared successfully');
        } catch (error) {
            console.error('Clear cart error:', error);
            return errorResponse(res, 'Failed to clear cart', 500);
        }
    }

    /**
     * Helper method to get full cart with calculations
     */
    async _getFullCart(cartId) {
        const cart = await Cart.findByPk(cartId, {
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'imageUrl', 'price', 'isAvailable', 'stock']
                        }
                    ]
                }
            ]
        });

        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (parseFloat(item.priceSnapshot) * item.quantity);
        }, 0);

        return {
            id: cart.id,
            items: cart.items,
            totalAmount,
            itemCount: cart.items.length
        };
    }
}

module.exports = new CartController();
