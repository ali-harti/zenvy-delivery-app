const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return errorResponse(res, 400, 'Un compte avec cet email existe déjà');
        }

        // Valider le rôle
        const validRoles = ['customer', 'courier'];
        if (!validRoles.includes(role)) {
            return errorResponse(res, 400, 'Rôle invalide. Utilisez "customer" ou "courier"');
        }

        // Créer l'utilisateur
        const user = await User.create({
            email,
            password,
            first_name,
            last_name,
            phone,
            role
        });

        // Générer le token JWT
        const token = generateToken(user.id, user.role);

        successResponse(res, 201, {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                role: user.role
            },
            token
        }, 'Inscription réussie');

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        errorResponse(res, 500, 'Erreur lors de l\'inscription');
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier que l'utilisateur existe
        const user = await User.findByEmail(email);
        if (!user) {
            return errorResponse(res, 401, 'Email ou mot de passe incorrect');
        }

        // Vérifier que le compte est actif
        if (!user.is_active) {
            return errorResponse(res, 401, 'Ce compte a été désactivé');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await User.comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Email ou mot de passe incorrect');
        }

        // Générer le token JWT
        const token = generateToken(user.id);

        successResponse(res, 200, {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                role: user.role
            },
            token
        }, 'Connexion réussie');

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        errorResponse(res, 500, 'Erreur lors de la connexion');
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 404, 'Utilisateur non trouvé');
        }

        successResponse(res, 200, {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                role: user.role,
                created_at: user.created_at
            }
        }, 'Profil récupéré avec succès');

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        errorResponse(res, 500, 'Erreur serveur');
    }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;

        const updates = {};
        if (first_name) updates.first_name = first_name;
        if (last_name) updates.last_name = last_name;
        if (phone) updates.phone = phone;

        const updatedUser = await User.update(req.user.id, updates);

        successResponse(res, 200, {
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                phone: updatedUser.phone,
                role: updatedUser.role
            }
        }, 'Profil mis à jour avec succès');

    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        errorResponse(res, 500, 'Erreur lors de la mise à jour');
    }
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findByEmail(req.user.email);

        // Vérifier le mot de passe actuel
        const isPasswordValid = await User.comparePassword(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Mot de passe actuel incorrect');
        }

        // Mettre à jour le mot de passe
        await User.updatePassword(user.id, newPassword);

        successResponse(res, 200, null, 'Mot de passe changé avec succès');

    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        errorResponse(res, 500, 'Erreur lors du changement de mot de passe');
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
};
