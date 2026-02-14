const { User, Cart, Merchant } = require('../models');
const { generateAccessToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, address } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return errorResponse(res, 'Email already registered', 409);
            }

            // Hash password
            const passwordHash = await User.hashPassword(password);

            // Create user
            const user = await User.create({
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                address,
                role: req.body.role || 'customer'
            });

            // Create cart for user
            await Cart.create({ userId: user.id });

            // Generate token
            const token = generateAccessToken({ id: user.id, email: user.email, role: user.role });

            return successResponse(res, {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role
                }
            }, 'Registration successful', 201);
        } catch (error) {
            console.error('Register error:', error);
            return errorResponse(res, 'Registration failed: ' + error.message, 500);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return errorResponse(res, 'Invalid credentials', 401);
            }

            // Check if active
            if (!user.isActive) {
                return errorResponse(res, 'Account is deactivated', 403);
            }

            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return errorResponse(res, 'Invalid credentials', 401);
            }

            // Update last login
            await user.update({ lastLoginAt: new Date() });

            // Helper for token payload
            const payload = { id: user.id, email: user.email, role: user.role };
            let merchantData = null;

            // If merchant, fetch merchant profile
            if (user.role === 'merchant') {
                const merchant = await Merchant.findOne({ where: { userId: user.id } });
                if (merchant) {
                    payload.merchantId = merchant.id;
                    merchantData = {
                        id: merchant.id,
                        businessName: merchant.businessName,
                        status: merchant.status
                    };
                }
            }

            // Generate token
            const token = generateAccessToken(payload);

            return successResponse(res, {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    role: user.role
                },
                ...(merchantData && { merchant: merchantData })
            }, 'Login successful');
        } catch (error) {
            console.error('Login error:', error);
            return errorResponse(res, 'Login failed: ' + error.message, 500);
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    async getProfile(req, res) {
        try {
            const user = req.user; // From authenticate middleware

            return successResponse(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            return errorResponse(res, 'Failed to fetch profile', 500);
        }
    }

    /**
     * Update user profile
     * PATCH /api/auth/profile
     */
    async updateProfile(req, res) {
        try {
            const { firstName, lastName, phone, address } = req.body;
            const user = req.user;

            await user.update({
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone && { phone }),
                ...(address && { address })
            });

            return successResponse(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address
                }
            }, 'Profile updated successfully');
        } catch (error) {
            console.error('Update profile error:', error);
            return errorResponse(res, 'Failed to update profile', 500);
        }
    }
}

module.exports = new AuthController();
