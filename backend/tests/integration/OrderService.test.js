/**
 * OrderService Integration Tests (FIXED)
 * Tests concurrency-safe checkout
 */

const OrderService = require('../../src/services/OrderService');
const { User, Store, Product, Cart, CartItem } = require('../../src/models');
const { ConflictError } = require('../../src/utils/errors');

describe('OrderService - Concurrency Tests', () => {
    let customer, store, product1, product2, cart;

    beforeEach(async () => {
        // Create test data
        customer = await User.create({
            email: 'test@test.com',
            passwordHash: 'hashed',
            firstName: 'Test',
            lastName: 'User',
            role: 'customer',
            phone: '+1234567890'
        });

        store = await Store.create({
            name: 'Test Store',
            category: 'food',
            address: '123 Test St',
            deliveryFee: 10.00,
            isActive: true
        });

        product1 = await Product.create({
            storeId: store.id,
            name: 'Product 1',
            price: 50.00,
            stock: 5,
            isAvailable: true
        });

        product2 = await Product.create({
            storeId: store.id,
            name: 'Product 2',
            price: 30.00,
            stock: 10,
            isAvailable: true
        });

        cart = await Cart.create({ userId: customer.id });

        await CartItem.create({
            cartId: cart.id,
            productId: product1.id,
            quantity: 2
        });

        await CartItem.create({
            cartId: cart.id,
            productId: product2.id,
            quantity: 1
        });
    });

    test('creates order and decrements stock', async () => {
        const order = await OrderService.createOrderFromCart({
            userId: customer.id,
            deliveryAddress: '456 Delivery St',
            paymentMethod: 'cash_on_delivery'
        });

        expect(order).toBeDefined();
        expect(parseFloat(order.totalAmount)).toBe(140.00); // (50*2 + 30*1) + 10 delivery
        expect(order.status).toBe('pending');

        // Verify stock decremented
        await product1.reload();
        await product2.reload();

        expect(product1.stock).toBe(3); // 5 - 2
        expect(product2.stock).toBe(9); // 10 - 1

        // Verify cart cleared
        const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
        expect(cartItems.length).toBe(0);
    });

    test('throws ConflictError when insufficient stock', async () => {
        // Update cart to request more than available
        await CartItem.update(
            { quantity: 10 }, // Request 10, but only 5 available
            { where: { cartId: cart.id, productId: product1.id } }
        );

        await expect(
            OrderService.createOrderFromCart({
                userId: customer.id,
                deliveryAddress: '456 Delivery St',
                paymentMethod: 'cash_on_delivery'
            })
        ).rejects.toThrow(ConflictError);

        // Verify stock unchanged
        await product1.reload();
        expect(product1.stock).toBe(5);
    });

    test('handles concurrent checkouts correctly', async () => {
        // Simulate 3 concurrent customers trying to buy the same product
        // Product has stock of 5, each wants 2

        const promises = [];
        for (let i = 0; i < 3; i++) {
            // FIXED: Remove space in variable name
            const concurrentUser = await User.create({
                email: `concurrent${i}@test.com`,
                passwordHash: 'hashed',
                firstName: 'Concurrent',
                lastName: `User${i}`,
                role: 'customer',
                phone: `+12345678${90 + i}`
            });

            // FIXED: Correct variable name
            const concurrentCart = await Cart.create({ userId: concurrentUser.id });
            await CartItem.create({
                cartId: concurrentCart.id,
                productId: product1.id,
                quantity: 2
            });

            promises.push(
                OrderService.createOrderFromCart({
                    userId: concurrentUser.id,
                    deliveryAddress: '789 Concurrent St',
                    paymentMethod: 'cash_on_delivery'
                }).catch(err => err) // Catch errors to see results
            );
        }

        const results = await Promise.all(promises);

        // Count successes vs failures
        const successes = results.filter(r => r.id !== undefined);
        const failures = results.filter(r => r instanceof Error);

        // With stock of 5, only 2 orders of quantity 2 should succeed
        expect(successes.length).toBe(2);
        expect(failures.length).toBe(1);
        expect(failures[0]).toBeInstanceOf(ConflictError);

        // Verify final stock - CRITICAL assertion
        await product1.reload();
        expect(product1.stock).toBe(1); // 5 - 2 - 2 = 1

        // CRITICAL: Verify no negative stock
        expect(product1.stock).toBeGreaterThanOrEqual(0);
    });

    test('CRITICAL: no negative stock under any circumstance', async () => {
        // Set product stock to 3
        await product1.update({ stock: 3 });

        // 5 concurrent users each want 2 items
        const promises = [];
        for (let i = 0; i < 5; i++) {
            const user = await User.create({
                email: `stress${i}@test.com`,
                passwordHash: 'hashed',
                firstName: 'Stress',
                lastName: `User${i}`,
                role: 'customer',
                phone: `+12345679${i}`
            });

            const userCart = await Cart.create({ userId: user.id });
            await CartItem.create({
                cartId: userCart.id,
                productId: product1.id,
                quantity: 2
            });

            promises.push(
                OrderService.createOrderFromCart({
                    userId: user.id,
                    deliveryAddress: 'Stress Test St',
                    paymentMethod: 'cash_on_delivery'
                }).catch(err => err)
            );
        }

        await Promise.all(promises);

        // Final assertion: stock must never be negative
        await product1.reload();
        expect(product1.stock).toBeGreaterThanOrEqual(0);
        expect(product1.stock).toBeLessThanOrEqual(3);
    });
});
