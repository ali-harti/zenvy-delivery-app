const { sequelize, User } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createTestCourier() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        const email = 'courier.test@zenvy.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Cleanup existing test user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('⚠️  User exists, cleaning up...');
            await existingUser.destroy();
            console.log('🗑️  Old user deleted.');
        }

        // 2. Create User
        console.log('👤 Creating test courier...');
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            firstName: 'Test',
            lastName: 'Courier',
            phone: '+212600000088',
            role: 'courier',
            isActive: true,
            address: 'Central Station, Casablanca',
        });

        console.log('\n✨ Test Courier Account Ready! ✨');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Error creating test courier:', error);
    } finally {
        await sequelize.close();
    }
}

createTestCourier();
