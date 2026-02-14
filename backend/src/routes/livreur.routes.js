const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
// router.use(authorize('courier')); // Optional: restrict to couriers

router.get('/profile', async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'preferredVehicle', 'currentZone', 'isOnline', 'locationPermission', 'notificationPermission', 'onboardingComplete'] // Add rating if exists
        });

        // Mock rating for now if not in DB
        const profile = user.toJSON();
        profile.name = `${user.firstName} ${user.lastName}`;
        profile.rating = 4.9; // Mock

        res.json({ success: true, data: profile });
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/onboarding/complete', async (req, res) => {
    try {
        const { preferredVehicle, currentZone, locationPermission, notificationPermission, isOnline } = req.body;

        await User.update({
            preferredVehicle,
            currentZone,
            locationPermission,
            notificationPermission,
            isOnline,
            onboardingComplete: true
        }, {
            where: { id: req.user.id }
        });

        res.json({ success: true, message: 'Onboarding completed' });
    } catch (error) {
        console.error('Onboarding Complete Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/vehicle', async (req, res) => {
    try {
        const { vehicle } = req.body;
        await User.update({ preferredVehicle: vehicle }, { where: { id: req.user.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.put('/zone', async (req, res) => {
    try {
        const { zone } = req.body;
        await User.update({ currentZone: zone }, { where: { id: req.user.id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Helper for zones
router.get('/zones/available', (req, res) => {
    // Mock zones
    res.json({
        success: true,
        data: [
            { id: '1', name: 'Casablanca Anfa', city: 'Casablanca', latitude: 33.5898, longitude: -7.6038, radiusKm: 5 },
            { id: '2', name: 'Marrakech Gueliz', city: 'Marrakech', latitude: 31.6295, longitude: -7.9811, radiusKm: 4 },
        ]
    });
});

module.exports = router;
