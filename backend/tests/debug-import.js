try {
    console.log('Require controller...');
    const controller = require('../src/controllers/MerchantController');
    console.log('✅ Controller loaded:', controller);
} catch (e) {
    console.error('❌ Failed:', e);
}
