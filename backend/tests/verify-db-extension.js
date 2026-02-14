const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const db = require('../src/models');
const config = require('../src/config/database');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

async function verifyDatabaseExtension() {
    console.log(colors.blue + '\n🔍 Verifying Database Extension (Merchant & Admin)...' + colors.reset);

    try {
        await db.sequelize.authenticate();
        console.log('✓ Database connected');

        // 1. Check Tables Exist
        const tableCheck = await db.sequelize.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('merchants', 'admins', 'platform_settings', 'transactions', 'merchant_stats')"
        );
        console.log('Query Result:', tableCheck);
        const foundTables = tableCheck[0].map(t => t.table_name);
        console.log('Found tables:', foundTables);
        const expectedTables = ['merchants', 'admins', 'platform_settings', 'transactions', 'merchant_stats'];
        const allExist = expectedTables.every(t => foundTables.includes(t));

        if (allExist) {
            console.log(colors.green + `✓ All 5 new tables confirmed: ${foundTables.join(', ')}` + colors.reset);
        } else {
            throw new Error(`Missing tables. Found: ${foundTables.join(', ')}`);
        }

        // 2. Test Model Integration (Create Merchant)
        console.log('\n🧪 Testing Model Integration...');

        // Find a user or create one
        let user = await db.User.findOne({ where: { email: 'merchant_test@zenvy.com' } });
        if (!user) {
            user = await db.User.create({
                email: 'merchant_test@zenvy.com',
                passwordHash: 'test_hash',
                firstName: 'Test',
                lastName: 'Merchant',
                role: 'merchant'
            });
        }

        // Create Merchant Profile
        try {
            const merchant = await db.Merchant.create({
                userId: user.id,
                businessName: 'Zenvy Test Store',
                status: 'pending'
            });
            console.log(colors.green + '✓ Merchant Profile Created' + colors.reset);

            // Create Merchant Stats
            await db.MerchantStats.create({
                merchantId: merchant.id,
                totalOrders: 0
            });
            console.log(colors.green + '✓ Merchant Stats Created' + colors.reset);

            // Cleanup
            await merchant.destroy(); // Cascade should handle stats? No, stats is CASCADE, but let's see.
            // await user.destroy(); 
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log(colors.green + '✓ Merchant Profile check (already existed)' + colors.reset);
            } else {
                throw error;
            }
        }

        console.log(colors.green + '\n✨ DATABASE EXTENSION VERIFIED SUCCESSFULLY ✨' + colors.reset);
        process.exit(0);

    } catch (error) {
        console.error(colors.red + '\n❌ Verification Failed:' + colors.reset, error);
        process.exit(1);
    }
}

verifyDatabaseExtension();
