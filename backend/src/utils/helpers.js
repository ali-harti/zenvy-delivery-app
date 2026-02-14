/**
 * Réponse de succès standardisée
 */
const successResponse = (res, statusCode, data, message = 'Succès') => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Réponse d'erreur standardisée
 */
const errorResponse = (res, statusCode, message, errors = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors })
    });
};

/**
 * Formater une date pour l'affichage
 */
const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Calculer le total d'une commande
 */
const calculateOrderTotal = (items, deliveryFee) => {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        deliveryFee: parseFloat(deliveryFee.toFixed(2)),
        total: parseFloat((subtotal + deliveryFee).toFixed(2))
    };
};

module.exports = {
    successResponse,
    errorResponse,
    formatDate,
    calculateOrderTotal
};
