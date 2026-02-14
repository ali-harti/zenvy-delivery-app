const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/update', async (req, res) => {
    try {
        const { location, notification } = req.body;
        const updateData = {};
        if (location !== undefined) updateData.locationPermission = location;
        if (notification !== undefined) updateData.notificationPermission = notification;

        await User.update(updateData, {
            where: { id: req.user.id }
        });

        res.json({ success: true, message: 'Permissions updated' });
    } catch (error) {
        console.error('Permissions Update Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
